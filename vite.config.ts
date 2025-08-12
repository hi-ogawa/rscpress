import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";
import rscpress from "./src/lib/plugins";
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
	plugins: [rscpress(), tailwindcss(), inspect()],
});
