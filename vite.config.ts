import rsc from "@vitejs/plugin-rsc";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import inspect from "vite-plugin-inspect";

export default defineConfig({
	plugins: [
		rsc({
			entries: {
				rsc: "./src/lib/framework/entry.rsc.tsx",
				ssr: "./src/lib/framework/entry.ssr.tsx",
				client: "./src/lib/framework/entry.browser.tsx",
			},
		}),
		react(),
		inspect(),
		mdxPlugin(),
	],
});

// https://github.com/mdx-js/mdx/blob/2b3381a8962dc888c0f2ed181cf80c6a1140b662/packages/rollup/lib/index.js
import { createFormatAwareProcessors } from "@mdx-js/mdx/internal-create-format-aware-processors";
import { VFile } from "vfile";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import rehypeShikiFromHighlighter, { type RehypeShikiCoreOptions } from "@shikijs/rehype/core";

function mdxPlugin(): Plugin[] {
	let processors: ReturnType<typeof createFormatAwareProcessors>;

	return [
		{
			name: "rscpress:mdx",
			async config() {
				const highlighter = await createHighlighterCore({
					themes: [
						import("@shikijs/themes/vitesse-light"),
						import("@shikijs/themes/vitesse-dark"),
					],
					langs: [
						import("@shikijs/langs/json"),
						import("@shikijs/langs/javascript"),
						import("@shikijs/langs/shell"),
					],
					engine: createOnigurumaEngine(() => import("shiki/wasm")),
				});
				processors = createFormatAwareProcessors({
					remarkPlugins: [remarkGfm, remarkDirective, remarkFrontmatter],
					rehypePlugins: [
						// https://shiki.style/packages/rehype
						[
							rehypeShikiFromHighlighter,
							highlighter,
							{
								themes: {
									light: "vitesse-light",
									dark: "vitesse-dark",
								},
								transformers: [],
							} satisfies RehypeShikiCoreOptions,
						],
					],
				});
			},
			async transform(code, id) {
				const { filename, query } = parseIdQuery(id);
				if (!("mdx" in query)) return;
				const file = new VFile({ path: filename, value: code });
				const compiled = await processors.process(file);
				const output = String(compiled.value);
				return output;
			},
		},
	];
}

// https://github.com/vitejs/vite-plugin-vue/blob/06931b1ea2b9299267374cb8eb4db27c0626774a/packages/plugin-vue/src/utils/query.ts#L13
function parseIdQuery(id: string): {
	filename: string;
	query: {
		[k: string]: string;
	};
} {
	if (!id.includes("?")) return { filename: id, query: {} };
	const [filename, rawQuery] = id.split(`?`, 2) as [string, string];
	const query = Object.fromEntries(new URLSearchParams(rawQuery));
	return { filename, query };
}
