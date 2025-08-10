import type React from "react";
import type { FeatureConfig, HeroConfig } from "./components/home";

export type RouteFrontmatter = {
	layout?: "home" | "doc" | "page";
	hero?: HeroConfig;
	features?: FeatureConfig[];
};

export type RouteModule = {
	default: React.FC;
	frontmatter?: RouteFrontmatter;
};
