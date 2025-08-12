import fs from "node:fs";
import path from "node:path";
import { createFormatAwareProcessors } from "@mdx-js/mdx/internal-create-format-aware-processors";
import rehypeShikiFromHighlighter, {
	type RehypeShikiCoreOptions,
} from "@shikijs/rehype/core";
import type { Code, Root } from "mdast";
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
					format: "mdx",
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

				// convert vitepress style directive to remark-directive
				// "::: code-group" => ":::code-group"
				// TODO: "">>>snippet" => "::snippet"
				// TODO: "::: tip" => ":::tip"
				code = code.replace(/^::: code-group\b/gm, ":::code-group ");

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
					node.data ??= {};
					node.data.hName = "div";
					node.data.hProperties = {
						class: `vp-code-group`,
					};
					const codes: Code[] = [];
					for (const c of node.children) {
						if (c.type !== "code") {
							file.info("Code group must contain only code blocks");
							continue;
						}
						codes.push(c);
					}
					const titles = codes.map(
						(c) => (c.type === "code" && c.meta && getCodeTitle(c.meta)) || "",
					);
					const id = node.position?.start.offset!;
					node.children = [
						{
							type: "html",
							value: "",
							data: {
								hName: "div",
								hProperties: {
									class: `tabs`,
								},
								hChildren: titles.flatMap((title, i) => [
									{
										type: "element",
										tagName: "input",
										properties: {
											type: "radio",
											name: `group-${id}`,
											id: `group-${id}:${i}`,
											value: i,
											defaultChecked: i === 0,
										},
										children: [],
									},
									// TODO: title icon https://github.com/yuyinws/vitepress-plugin-group-icons
									{
										type: "element",
										tagName: "label",
										properties: {
											for: `group-${id}:${i}`,
										},
										children: [{ type: "text", value: title }],
									},
								]),
							},
						},
						{
							type: "paragraph",
							data: {
								hName: "div",
								hProperties: {
									class: `blocks`,
								},
							},
							children: codes.map((c, i) => ({
								...c,
								// pass metadata to code block
								meta: c.meta?.replace(
									CODE_TITLE_RE,
									(_, m) => `[code-group:${i}:${m}]`,
								),
							})) as any,
						},
					];
					return;
				}
				if (node.name === "snippet") {
					const value = (node.children[0] as any)?.value;
					if (!value) {
						file.info("Invalid 'snippet' directive");
					}
					// TODO: use vite resolve and raw loader
					const filePath = path.resolve(value);
					const data = fs.readFileSync(filePath, "utf-8");
					node.children = [
						{
							type: "code",
							lang: path.extname(filePath).slice(1) || "text",
							// TODO: meta
							// meta: `[${path.basename(file)}]`,
							value: data,
						},
					];
					return;
				}
				file.info("Unknown directive: " + node.name);
			}
		});
	};
}

const CODE_TITLE_RE = /\[([^\]]+)\]/;

function getCodeTitle(s: string): string {
	const match = s.match(CODE_TITLE_RE);
	if (match) {
		return match[1];
	}
	return "";
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
				const raw = this.options.meta?.__raw || "";
				const title = getCodeTitle(raw) || "";

				// div.vp-code-block-title
				//   div.vp-code-block-title-bar
				//     span.vp-code-block-title-text
				//        {title}
				//   div.language-<lang>
				//     {...}

				let codeBlock = {
					type: "element",
					tagName: "div",
					properties: {
						className: [
							`language-${lang}`,
							// "vp-adaptive-theme",
							title.startsWith("code-group:") && "code-group-block",
							title.startsWith("code-group:0:") && "active",
						].filter(Boolean),
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
				};

				if (title && !title.startsWith("code-group:")) {
					// TODO: title icon https://github.com/yuyinws/vitepress-plugin-group-icons
					codeBlock = {
						type: "element",
						tagName: "div",
						properties: {
							className: ["vp-code-block-title"],
						},
						children: [
							{
								type: "element",
								tagName: "div",
								properties: {
									className: ["vp-code-block-title-bar"],
								},
								children: [
									{
										type: "element",
										tagName: "span",
										properties: {
											className: ["vp-code-block-title-text"],
										},
										children: [{ type: "text", value: title }],
									},
								],
							},
							codeBlock,
						],
					};
				}

				node.children = [codeBlock] as any;
			},
		},
	];
}
