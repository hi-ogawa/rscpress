import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";

// TODO: for now, we use direct relative path for dev server reload
// import rscpress from "@hiogawa/rscpress/plugin";
import rscpress from "../src/plugin";

export default defineConfig({
<<<<<<< HEAD
	clearScreen: false,
=======
>>>>>>> main
	plugins: [rscpress(), inspect()],
});
