import { createFormatAwareProcessors } from "@mdx-js/mdx/internal-create-format-aware-processors";
import rehypeShikiFromHighlighter, {
	type RehypeShikiCoreOptions,
} from "@shikijs/rehype/core";
import { h } from "hastscript";
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

// https://vitepress.dev/guide/markdown#custom-containers
const CUSTOM_BLOCKS = ["info", "tip", "warning", "danger", "details"];

// https://vitepress.dev/guide/markdown#github-flavored-alerts
const GITHUB_ALERTS = ["note", "tip", "important", "warning", "caution"];

function remarkCustom() {
	return function (tree: Root, file: VFile) {
		visit(tree, function (node) {
			// https://github.com/remarkjs/remark-directive/
			if (
				node.type === "containerDirective" ||
				node.type === "leafDirective" ||
				node.type === "textDirective"
			) {
				if (CUSTOM_BLOCKS.includes(node.name)) {
					// add custom-block class
					const data = node.data || (node.data = {});
					const tagName = "div";
					data.hName = tagName;
					data.hProperties = h(tagName, node.attributes || {}).properties;
					data.hProperties["class"] = `custom-block ${node.name}`;
					// process label
					const directiveLabel = node.children[0];
					let label = node.name.toUpperCase();
					if (directiveLabel.data && "directiveLabel" in directiveLabel.data) {
						label = (directiveLabel as any).children[0].value;
						node.children.shift();
					}
					const labelNode = {
						type: "paragraph",
						children: [
							{
								type: "text",
								value: label,
							},
						],
						data: {
							hName: "p",
							hProperties: {
								class: "custom-block-title",
							},
						},
					};
					node.children.unshift(labelNode as any);
					return;
				}
				if (node.name === "code-group") {
					// TODO
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

			// TODO
			// https://vitepress.dev/guide/markdown#github-flavored-alerts
			if (node.type === "blockquote") {
				const first = node.children[0];
				if (!first || first.type !== "paragraph") return;
				let firstText = first.children[0];
				if (!firstText || firstText.type !== "text") return;
				const match = firstText.value.match(/^\[\!(\w+)\]/);
				if (!match) return;
				const alertType = match[1];
				if (GITHUB_ALERTS.includes(alertType)) {
					// add alert class
					const data = node.data || (node.data = {});
					const tagName = "div";
					data.hName = tagName;
					data.hProperties = h(tagName, {}).properties;
					data.hProperties["class"] = `custom-block ${alertType}`;

					// remove the first text node
					// node.children.shift();
					// // add a title
					// const titleNode = {
					// 	type: "element",
					// 	tagName: "p",
					// 	properties: { className: ["vp-alert-title"] },
					// 	children: [{ type: "text", value: alertType }],
					// };
					// node.children.unshift(titleNode);
				}
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
