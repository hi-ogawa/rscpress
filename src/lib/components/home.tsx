import type React from "react";
import { Features } from "./features";
import { Hero } from "./hero";
import "./home.css";

export interface HomeProps {
	children?: React.ReactNode;
	hero?: HeroConfig;
	features?: FeatureConfig[];
}

export interface HeroConfig {
	name?: string;
	text?: string;
	tagline?: string;
	image?: string | { src: string; alt?: string };
	actions?: Array<{
		theme?: "brand" | "alt";
		text: string;
		link: string;
	}>;
}

export interface FeatureConfig {
	icon?: string;
	title: string;
	details: string;
	link?: string;
}

export function Home(props: HomeProps) {
	const { children, hero, features } = props;

	return (
		<div className="VPHome">
			{hero && <Hero {...hero} />}
			{features && features.length > 0 && <Features features={features} />}
			{children && (
				<div className="VPHomeContent">
					<div className="container">
						<div className="vp-doc">{children}</div>
					</div>
				</div>
			)}
		</div>
	);
}
