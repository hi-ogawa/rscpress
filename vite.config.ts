import rsc from "@vitejs/plugin-rsc";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";
import { markdownPlugin } from "./src/lib/plugins/markdown";

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
		markdownPlugin(),
	],
});
