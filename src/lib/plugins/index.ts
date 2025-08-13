import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { pathToFileURL } from "node:url";
import react from "@vitejs/plugin-react";
import rsc, { type RscPluginOptions } from "@vitejs/plugin-rsc";
import { type Connect, type Plugin, type ResolvedConfig } from "vite";
import { RSC_POSTFIX } from "../framework/shared";
import type { SsgData } from "../types";
import { markdownPlugin } from "./markdown";

export default function rscpress(): Plugin[] {
	const rscPluginOptions: RscPluginOptions = {
		entries: {
			rsc: "./src/lib/framework/entry.rsc.tsx",
			ssr: "./src/lib/framework/entry.ssr.tsx",
			client: "./src/lib/framework/entry.browser.tsx",
		},
		useBuildAppHook: true,
	};

	return [
		{
			name: "rscpress:config",
			config(_config, env) {
				if (env.isPreview) {
					rscPluginOptions.serverHandler = false;
				}
			},
		},
		...react(),
		...rsc(rscPluginOptions),
		...markdownPlugin(),
		createVirtualPlugin("rscpress:routes", async function () {
			const globBase = "/src/example";
			const globPattern = `${globBase}/**/*.{md,mdx}`;
			function normalizeGlob(glob: Record<string, unknown>, globBase: string) {
				return Object.fromEntries(
					Object.entries(glob).map(([key, value]) => {
						key = key
							.slice(globBase.length)
							.replace(/\.\w*$/, "")
							.replace(/\/index$/, "/");
						return [key, value];
					}),
				);
			}
			return /* js */ `
const glob = import.meta.glob(${JSON.stringify(globPattern)}, { query: "?mdx" });
const globBase = ${JSON.stringify(globBase)};
const normalized = ${normalizeGlob.toString()}(glob, globBase);
export default normalized;
`;
		}),
		{
			name: "rscpress:ssg",
			config(_config, env) {
				return {
					appType: env.isPreview ? "mpa" : undefined,
				};
			},
			configurePreviewServer(server) {
				const notFoundHtml = fs.readFileSync(
					path.join(server.config.environments.client.build.outDir, "404.html"),
					"utf-8",
				);
				const notFoundMiddleware: Connect.NextHandleFunction = (
					_req,
					res,
					_next,
				) => {
					res.statusCode = 404;
					res.setHeader("Content-Type", "text/html");
					res.end(notFoundHtml);
				};
				// patch Vite 404 middleware
				// https://github.com/vitejs/vite/blob/946831f986cb797009b8178659d2b31f570c44ff/packages/vite/src/node/preview.ts#L268-L269
				const originalUse = server.middlewares.use;
				const patchUse = function (this: unknown, ...args: unknown[]) {
					if (
						typeof args[0] === "function" &&
						args[0].name === "vite404Middleware"
					) {
						args = [notFoundMiddleware];
					}
					originalUse.apply(this, args as any);
				};
				server.middlewares.use = patchUse as any;
			},
			buildApp: {
				async handler(builder) {
					await renderStatic(builder.config);
				},
			},
		},
	];
}

async function renderStatic(config: ResolvedConfig) {
	// import server entry
	const entryPath = path.join(config.environments.rsc.build.outDir, "index.js");
	const entry: typeof import("../framework/entry.rsc") = await import(
		pathToFileURL(entryPath).href
	);

	// entry provides a list of static paths
	const staticPaths = await entry.getStaticPaths();
	staticPaths.push("/404");

	const baseDir = config.environments.client.build.outDir;

	async function renderPage(pagePath: string) {
		const { html, rsc } = await entry.handleSsg(
			new Request(new URL(pagePath, "http://ssg.local")),
		);
		await writeFileX(html, path.join(baseDir, normalizeHtmlFilePath(pagePath)));
		await writeFileX(rsc, path.join(baseDir, pagePath + RSC_POSTFIX));
	}

	// render pages
	for (const staticPath of staticPaths) {
		config.logger.info("[rscpress:ssg] -> " + staticPath);
		await renderPage(staticPath);
	}

	// inject extra ssg data into html
	const ssgData: SsgData = {
		notFound: fs
			.readFileSync(path.join(baseDir, "404" + RSC_POSTFIX))
			.toString("base64"),
	};

	for (const staticPath of staticPaths) {
		const htmlFilePath = path.join(baseDir, normalizeHtmlFilePath(staticPath));
		await updateFile(htmlFilePath, (content) => {
			return content.replace(
				`"__rscpress_ssg_placeholder__"`,
				`window.__rscpress_ssg = ${JSON.stringify(ssgData)}`,
			);
		});
	}
}

async function writeFileX(stream: ReadableStream, filePath: string) {
	await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
	await fs.promises.writeFile(filePath, Readable.fromWeb(stream as any));
}

async function updateFile(
	filePath: string,
	updateFn: (content: string) => string,
) {
	const content = await fs.promises.readFile(filePath, "utf-8");
	const updatedContent = updateFn(content);
	await fs.promises.writeFile(filePath, updatedContent);
}

function normalizeHtmlFilePath(p: string) {
	if (p.endsWith("/")) {
		return p + "index.html";
	}
	return p + ".html";
}

function createVirtualPlugin(name: string, load: Plugin["load"]) {
	name = "virtual:" + name;
	return {
		name: `rscpress:virtual-${name}`,
		resolveId(source, _importer, _options) {
			return source === name ? "\0" + name : undefined;
		},
		load(id, options) {
			if (id === "\0" + name) {
				return (load as Function).apply(this, [id, options]);
			}
		},
	} satisfies Plugin;
}
