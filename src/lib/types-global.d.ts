declare module "*?mdx" {
	const default_: import("react").FC;
	export default default_;
	export const frontmatter: import("./types").RouteFrontmatter;
}

declare module "virtual:rscpress:routes" {
	const default_: Record<string, () => Promise<import("./types").RouteModule>>;
	export default default_;
}
