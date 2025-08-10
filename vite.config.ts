import rsc from "@vitejs/plugin-rsc";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin, type ResolvedConfig } from "vite";
import inspect from "vite-plugin-inspect";
import { markdownPlugin } from "./src/lib/plugins/markdown";
import path from "node:path";
import { pathToFileURL } from "node:url";
import assert from "node:assert";
import { Readable } from "node:stream";
import fs from "node:fs";
import { RSC_POSTFIX } from "./src/lib/framework/shared";

export default defineConfig((env) => ({
	plugins: [
		rsc({
			entries: {
				rsc: "./src/lib/framework/entry.rsc.tsx",
				ssr: "./src/lib/framework/entry.ssr.tsx",
				client: "./src/lib/framework/entry.browser.tsx",
			},
			useBuildAppHook: true,
			serverHandler: env.isPreview ? false : undefined,
		}),
		react(),
		inspect(),
		rscpress(),
	],
}));

function rscpress(): Plugin[] {
	return [
		...markdownPlugin(),
		{
			name: "rscpress:routes",
			resolveId(source) {
				if (source === "virtual:rscpress:routes") {
					return "\0" + source;
				}
			},
			load(id) {
				if (id === "\0virtual:rscpress:routes") {
					// TODO
					// const glob = import.meta.glob("/src/example/**/*.{md,mdx}", { query: "?mdx" });
					return /* js */ `
export default {
	"/": () => import("/src/example/index.md?mdx"),
	"/guide/getting-started": () => import("/src/example/guide/getting-started.md?mdx"),
};
`;
				}
			},
		},
		{
			name: "rscpress:ssg",
			config(_config, env) {
				if (env.isPreview) {
					return {
						appType: "mpa",
					};
				}
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
	const entry: typeof import("./src/lib/framework/entry.rsc") = await import(
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
