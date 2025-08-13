import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";
import rscpress from "@hiogawa/rscpress/plugin";

export default defineConfig({
	plugins: [rscpress(), inspect()],
});
