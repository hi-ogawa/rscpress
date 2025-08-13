import * as vite from "vite";

const inlineConfig: vite.InlineConfig = {
	configLoader: "native",
	configFile: "docs/vite.config.ts",
	root: "docs",
};

const builder = await vite.createBuilder(inlineConfig);
await builder.buildApp();
