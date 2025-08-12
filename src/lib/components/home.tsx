import type React from "react";
import { Features } from "./features";
import { Hero } from "./hero";

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
		<div className="min-h-screen">
			{hero && <Hero {...hero} />}
			{features && features.length > 0 && <Features features={features} />}
			{children && (
				<section className="py-20 bg-gray-50">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<div className="prose prose-lg max-w-4xl mx-auto">{children}</div>
					</div>
				</section>
			)}
		</div>
	);
}
