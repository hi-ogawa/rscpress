import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";
import rscpress from "./src/lib/plugins";

export default defineConfig({
	plugins: [rscpress(), tailwindcss(), inspect()],
});
