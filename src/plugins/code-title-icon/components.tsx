import { generateCss } from "./utils";

// for now, load directly on server runtime
export async function CodeTitleIconStyle() {
	const css = await generateCss();
	return <style precedence="rscpress/code-title-icon">{css}</style>;
}
