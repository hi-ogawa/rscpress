import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";
import rscpress from "./src/lib/plugins";

export default defineConfig({
	plugins: [
		rscpress(),
		inspect(),
	],
});
