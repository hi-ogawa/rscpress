import type { Plugin } from "vite";

export function createVirtualPlugin(name: string, load: Plugin["load"]) {
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

// https://github.com/vitejs/vite-plugin-vue/blob/06931b1ea2b9299267374cb8eb4db27c0626774a/packages/plugin-vue/src/utils/query.ts#L13
export function parseIdQuery(id: string): {
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
