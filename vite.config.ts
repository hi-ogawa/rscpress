import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";
import rscpress from "./src/lib/plugins";

export default defineConfig((env) => ({
	plugins: [
		rsc({
			entries: {
				rsc: "./src/lib/framework/entry.rsc.tsx",
				ssr: "./src/lib/framework/entry.ssr.tsx",
				client: "./src/lib/framework/entry.browser.tsx",
			},
			useBuildAppHook: true,
			serverHandler: env.isPreview ? false : undefined,
		}),
		react(),
		inspect(),
		rscpress(),
	],
}));
