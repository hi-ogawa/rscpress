declare module "*?mdx" {
	const default_: import("react").FC;
	export default default_;
	export const frontmatter: Record<string, unknown>;
}
