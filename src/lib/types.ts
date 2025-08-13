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

export type SsgData = {
	notFound: string;
};

declare global {
	var __rscpress_ssg: SsgData | undefined;
}
