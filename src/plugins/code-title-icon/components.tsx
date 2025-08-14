import { generateCss } from "./utils";

export async function CodeTitleIconStyle() {
	const css = await generateCss();
	return <style precedence="rscpress/code-title-icon">{css}</style>;
}
