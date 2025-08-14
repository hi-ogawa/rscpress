import fs from "node:fs";
import path from "node:path";
import { createFormatAwareProcessors } from "@mdx-js/mdx/internal-create-format-aware-processors";
import rehypeShiki, { type RehypeShikiOptions } from "@shikijs/rehype";
import * as acorn from "acorn";
import type { Code, Root } from "mdast";
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import type { ShikiTransformer } from "shiki";
import { visit } from "unist-util-visit";
import { VFile } from "vfile";
import type { Plugin, Rollup } from "vite";

declare module "vfile" {
	interface DataMap {
		rscpress: {
			ctx: Rollup.TransformPluginContext;
		};
	}
}

export function markdownPlugin(): Plugin[] {
	// https://github.com/mdx-js/mdx/blob/2b3381a8962dc888c0f2ed181cf80c6a1140b662/packages/rollup/lib/index.js
	let processors: ReturnType<typeof createFormatAwareProcessors>;

	return [
		{
			name: "rscpress:mdx",
			async config() {
				processors = createFormatAwareProcessors({
					format: "mdx",
					remarkPlugins: [
						remarkGfm,
						remarkDirective,
						remarkFrontmatter,
						remarkMdxFrontmatter,
						remarkRscpress,
					],
					rehypePlugins: [
						// https://shiki.style/packages/rehype
						[
							rehypeShiki,
							{
								themes: {
									light: "github-light",
									dark: "github-dark",
								},
								langs: [],
								lazy: true,
								defaultColor: false,
								addLanguageClass: true,
								defaultLanguage: "text",
								transformers: createRscpressShikiTransformer(),
							} satisfies RehypeShikiOptions,
						],
					],
				});
			},
			async transform(code, id) {
				const { filename, query } = parseIdQuery(id);
				if (!("mdx" in query)) return;

				const file = new VFile({
					path: filename,
					value: code,
					data: {
						rscpress: { ctx: this },
					},
				});
				const compiled = await processors.process(file);
				for (const message of compiled.messages) {
					this.warn(message.message);
				}
				const output = String(compiled.value);
				return output;
			},
		},
	];
}

// https://vitepress.dev/guide/markdown#custom-containers
const CUSTOM_BLOCKS = ["info", "tip", "warning", "danger", "details"];

// https://vitepress.dev/guide/markdown#github-flavored-alerts
const GITHUB_ALERTS = ["NOTE", "TIP", "IMPORTANT", "WARNING", "CAUTION"];
const GITHUB_ALERTS_RE = new RegExp(`^\\[!(${GITHUB_ALERTS.join("|")})\\]\n`);

function remarkRscpress() {
	return async function (tree: Root, file: VFile) {
		const { ctx } = file.data.rscpress!;
		const asyncTaskResults: Promise<void>[] = [];

		function pushTask(task: () => Promise<void>) {
			asyncTaskResults.push(task());
		}

		visit(tree, function (node) {
			// https://github.com/remarkjs/remark-directive/
			if (
				node.type === "containerDirective" ||
				node.type === "leafDirective" ||
				node.type === "textDirective"
			) {
				if (node.name === "code-group") {
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
					const newCodes = codes.map((c, i) => ({
						...c,
						// pass metadata to code highlighter transformer
						meta: c.meta?.replace(
							CODE_TITLE_RE,
							(_, m) => `[code-group:${i}:${m}]`,
						),
					}));
					const newNode = hJsx(
						"components.CodeGroup",
						{
							id: String(id),
							titles: hEstree(
								"mdxJsxAttributeValueExpression",
								JSON.stringify(titles),
							),
						},
						newCodes,
					);
					Object.assign(node, newNode);
					return;
				}
				if (node.name === "snippet") {
					const value = (node.children[0] as any)?.value;
					if (!value) {
						file.info("Invalid 'snippet' directive");
					}
					const code: Code = {
						type: "code",
						lang: "text",
						value: `(snippet:${value})`,
					};
					pushTask(async () => {
						const resolved = await ctx.resolve(value, file.path);
						if (!resolved) {
							file.info("Failed to resolve snippet file: " + value);
							return;
						}
						const id = resolved.id;
						const content = fs.readFileSync(id, "utf-8");
						code.lang = path.extname(id).slice(1);
						code.value = content;
						const title = node.attributes?.title ?? path.basename(id);
						code.meta = `[${title}]`;
					});
					node.children = [code];
					return;
				}

				if (CUSTOM_BLOCKS.includes(node.name)) {
					let title = node.name.toUpperCase();
					const c = node.children[0];
					if (c.data && "directiveLabel" in c.data) {
						// custom title in directive label
						title = (c as any).children[0].value;
						node.children.shift();
					}
					Object.assign(
						node,
						hJsx(
							"components.CustomContainer",
							{
								type: node.name,
								title,
							},
							node.children,
						),
					);
					return;
				}

				file.info("Unknown directive: " + node.name);
			}

			// https://vitepress.dev/guide/markdown#github-flavored-alerts
			if (node.type === "blockquote") {
				const p = node.children[0];
				if (p?.type === "paragraph" && p.children[0]?.type === "text") {
					const text = p.children[0].value;
					const match = text.match(GITHUB_ALERTS_RE);
					if (match) {
						p.children[0] = {
							type: "text",
							value: text.slice(match[0].length),
						};
						const title = match[1];
						Object.assign(
							node,
							hJsx(
								"components.CustomContainer",
								{
									type: title.toLowerCase(),
									title,
									github: hEstree("mdxJsxAttributeValueExpression", "true"),
								},
								node.children,
							),
						);
					}
				}
			}
		});

		tree.children.unshift(
			hEstree(
				"mdxjsEsm",
				`import * as components from ${JSON.stringify("@hiogawa/rscpress/components")}`,
			),
		);

		await Promise.all(asyncTaskResults);
	};
}

function hJsx(
	name: string,
	attributes: Record<string, MdxJsxAttribute["value"]>,
	children: any,
): MdxJsxFlowElement {
	return {
		type: "mdxJsxFlowElement",
		name,
		attributes: Object.entries(attributes).map(([key, value]) => ({
			type: "mdxJsxAttribute",
			name: key,
			value,
		})),
		children,
	};
}

function hEstree(
	type: "mdxjsEsm" | "mdxJsxAttributeValueExpression",
	value: string,
) {
	const estree = acorn.Parser.parse(value, {
		ecmaVersion: "latest",
		sourceType: "module",
	});
	return {
		type,
		value: value,
		data: {
			estree,
		},
	} as any;
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
function createRscpressShikiTransformer(): ShikiTransformer[] {
	return [
		{
			name: "vitepress:wrapper",
			pre(node) {
				node.properties.dir = "ltr";
				this.addClassToHast(node, [
					"shiki",
					"shiki-themes",
					"github-light",
					"github-dark",
				]);
			},
			code(node) {
				this.addClassToHast(node, "vp-code");
			},
			root(node) {
				const lang = this.options.lang;
				const raw = this.options.meta?.__raw || "";
				const title = getCodeTitle(raw) || "";
				const codeBlock = hJsx(
					"components.CodeBlock",
					{ lang, title },
					node.children,
				);
				node.children = [codeBlock] as any;
			},
		},
	];
}
