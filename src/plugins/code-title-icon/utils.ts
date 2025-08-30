import { sortBy } from "@hiogawa/utils";
import {
	encodeSvgForCss,
	getIconData,
	iconToHTML,
	iconToSVG,
} from "@iconify/utils";
import { builtinIcons } from "./builtin.ts";

export async function generateCss(icons: Record<string, string>) {
	let css = "";
	for (const [label, icon] of Object.entries(icons)) {
		const svg = encodeSvgForCss(await getSVG(icon));
		css += `\
[data-title='${label}']::before {
  content: '';
  --icon: url("data:image/svg+xml,${svg}");
}
`;
	}
	return css;
}

async function getSVG(icon: string) {
	if (icon.startsWith("<svg")) {
		return icon;
	}

	const [collection, iconName] = icon.split(":");
	if (collection) {
		const { icons } = await import(
			/* @vite-ignore */ `@iconify-json/${collection}`
		);
		const iconData = getIconData(icons, iconName);

		if (iconData) {
			const { attributes, body } = iconToSVG(iconData);
			const svg = iconToHTML(body, attributes);
			return svg;
		}
	}

	return "";
}

export function getCodeTitleIcon(title: string) {
	let keys = Object.keys(builtinIcons);
	keys = keys.filter((key) => title.includes(key));
	return sortBy(keys, (key) => -key.length)[0];
}
