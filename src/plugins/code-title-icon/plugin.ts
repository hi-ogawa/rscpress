import type { Plugin } from "vite";
import { parseIdQuery } from "../utils";
import { builtinIcons } from "./builtin";
import { generateCss } from "./utils";

export function codeTitleIconPlugin(pluginOptions?: {
	customIcon?: Record<string, string>;
}): Plugin[] {
	const icons = { ...builtinIcons, ...pluginOptions?.customIcon };
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
					// load them all for now
					return generateCss(icons);
				}

				if (id === "\0virtual:rscpress:code-title-icon") {
					return `\
export const icons = ${JSON.stringify(icons, null, 2)};
`;
				}
			},
		},
	];
}
