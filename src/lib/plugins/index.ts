import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { pathToFileURL } from "node:url";
import { type Connect, type Plugin, type ResolvedConfig } from "vite";
import { RSC_POSTFIX } from "../framework/shared";
import { markdownPlugin } from "./markdown";

export default function rscpress(): Plugin[] {
	return [
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

	// render rsc and html
	const baseDir = config.environments.client.build.outDir;

	// TODO: paralell
	for (const htmlPath of staticPaths) {
		config.logger.info("[rscpress:ssg] -> " + htmlPath);
		const rscPath = htmlPath + RSC_POSTFIX;
		const htmlResponse = await entry.default(
			new Request(new URL(htmlPath, "http://ssg.local")),
		);
		assert.equal(htmlResponse.status, 200);
		const htmlFile = path.join(baseDir, normalizeHtmlFilePath(htmlPath));
		await fs.promises.mkdir(path.dirname(htmlFile), { recursive: true });
		await fs.promises.writeFile(
			htmlFile,
			Readable.fromWeb(htmlResponse.body as any),
		);

		const rscResponse = await entry.default(
			new Request(new URL(rscPath, "http://ssg.local")),
		);
		assert.equal(rscResponse.status, 200);
		const rscFile = path.join(baseDir, rscPath);
		await fs.promises.mkdir(path.dirname(rscFile), { recursive: true });
		await fs.promises.writeFile(
			path.join(baseDir, rscPath),
			Readable.fromWeb(rscResponse.body as any),
		);
	}
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
