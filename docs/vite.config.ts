// TODO: reload fresh module during dev
import rscpress from "@hiogawa/rscpress/plugin";
import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";

export default defineConfig({
	plugins: [rscpress(), inspect()],
});
