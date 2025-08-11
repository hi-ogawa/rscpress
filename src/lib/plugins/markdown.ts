import { createFormatAwareProcessors } from "@mdx-js/mdx/internal-create-format-aware-processors";
import rehypeShikiFromHighlighter, {
	type RehypeShikiCoreOptions,
} from "@shikijs/rehype/core";
import type { Root } from "mdast";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import type { ShikiTransformer } from "shiki";
import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import { visit } from "unist-util-visit";
import { VFile } from "vfile";
import type { Plugin } from "vite";
import { remarkContainerSyntax } from "./mdx/remarkPlugins/containerSyntax";

export function markdownPlugin(): Plugin[] {
	// https://github.com/mdx-js/mdx/blob/2b3381a8962dc888c0f2ed181cf80c6a1140b662/packages/rollup/lib/index.js
	let processors: ReturnType<typeof createFormatAwareProcessors>;
	let highlighter: Awaited<ReturnType<typeof createHighlighterCore>>;

	return [
		{
			name: "rscpress:mdx",
			async config() {
				highlighter = await createHighlighterCore({
					themes: [import("@shikijs/themes/github-light")],
					langs: [
						import("@shikijs/langs/json"),
						import("@shikijs/langs/javascript"),
						import("@shikijs/langs/shell"),
					],
					engine: createOnigurumaEngine(() => import("shiki/wasm")),
				});
				processors = createFormatAwareProcessors({
					remarkPlugins: [
						remarkGfm,
						remarkContainerSyntax,
						remarkDirective,
						remarkFrontmatter,
						remarkMdxFrontmatter,
						remarkCustom,
					],
					rehypePlugins: [
						// https://shiki.style/packages/rehype
						[
							rehypeShikiFromHighlighter,
							highlighter,
							{
								themes: {
									light: "github-light",
								},
								addLanguageClass: true,
								defaultLanguage: "text",
								transformers: createVitepressTransformer(),
							} satisfies RehypeShikiCoreOptions,
						],
					],
				});
			},
			buildEnd() {
				if (this.environment.mode === "dev") {
					highlighter.dispose();
				}
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

function remarkCustom() {
	return function (tree: Root, file: VFile) {
		visit(tree, function (node) {
			// https://github.com/remarkjs/remark-directive/
			if (
				node.type === "containerDirective" ||
				node.type === "leafDirective" ||
				node.type === "textDirective"
			) {
				if (node.name === "code-group") {
					// TODO
					node.data ??= {};
					node.data.hName = "div";
					node.data.hProperties = {
						class: `vp-code-group`,
					};
					node.children = [
						{
							type: "list",
							data: {
								hName: "div",
								hProperties: {
									class: `tabs`,
								},
							},
							// TODO
							children: [],
						},
						{
							type: "list",
							data: {
								hName: "div",
								hProperties: {
									class: `vp-code-group-items`,
								},
							},
							children: node.children as any,
						},
					];
					return;
				}
				if (node.name === "snippet") {
					// TODO
					const value = (node.children[0] as any)?.value;
					if (!value) {
						file.info("Misisng value for '::snippet'");
					}
					node.children = [];
					return;
				}
				file.info("Unknown directive: " + node.name);
			}
		});
	};
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

// https://shiki.style/guide/transformers
function createVitepressTransformer(): ShikiTransformer[] {
	return [
		{
			name: "vitepress:wrapper",
			pre(node) {
				node.properties.dir = "ltr";
				this.addClassToHast(node, "shiki");
				this.addClassToHast(node, "shiki-themes");
				this.addClassToHast(node, "github-light");
				this.addClassToHast(node, "github-dark");
			},
			code(node) {
				this.addClassToHast(node, "vp-code");
			},
			root(node) {
				// TODO: vp-code-block-title via this.options.meta
				const lang = this.options.lang;
				node.children = [
					{
						type: "element",
						tagName: "div",
						properties: {
							className: [`language-${lang}`, "vp-adaptive-theme"],
						},
						children: [
							{
								type: "element",
								tagName: "button",
								properties: {
									className: ["copy"],
								},
							},
							{
								type: "element",
								tagName: "span",
								properties: {
									className: ["lang"],
								},
								children: [{ type: "text", value: lang || "text" }],
							},
							...(node.children as any),
						],
					},
				];
			},
		},
	];
}
