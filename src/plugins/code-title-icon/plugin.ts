import type { Plugin } from "vite";
import { parseIdQuery } from "../utils";
import { builtinIcons } from "./builtin";
import { generateCss } from "./utils";

export function codeTitleIconPlugin(pluginOptions?: {
	customIcon?: Record<string, string>;
}): Plugin[] {
	const icons = { ...builtinIcons, ...pluginOptions?.customIcon };
	const usedIcons = new Set<string>();
	return [
		{
			name: "rscpress:code-title-icon",
			resolveId(source) {
				if (source === "virtual:rscpress:code-title-icon.css") {
					return "\0" + source;
				}
				if (source === "virtual:rscpress:code-title-icon") {
					return "\0" + source;
				}
			},
			load(id) {
				// strip css `?direct` query
				const { filename } = parseIdQuery(id);
				if (filename === "\0virtual:rscpress:code-title-icon.css") {
					if (this.environment.mode === "build") {
						// TODO
						usedIcons;
						return generateCss(icons);
					}
					// load all during dev
					return generateCss(icons);
				}

				if (id === "\0virtual:rscpress:code-title-icon") {
					return `\
export const icons = ${JSON.stringify(icons, null, 2)};
`;
				}
			},
		},
		{
			name: "rscpress:code-title-icon:collect",
			transform: {
				handler(code, id) {
					// extract potential code block title from markdown
					const { query } = parseIdQuery(id);
					if ("mdx" in query) {
						const matches = code.matchAll(/\[([^\[\]]+)\]/g);
						const tokens = [...matches].map((m) => m[1]!);
						console.log(tokens);
						usedIcons.add;
					}
				},
			},
		},
	];
}
