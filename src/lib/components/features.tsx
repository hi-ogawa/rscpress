import type { FeatureConfig } from "./home";
import "./features.css";

export interface FeaturesProps {
	features: FeatureConfig[];
}

export function Features({ features }: FeaturesProps) {
	// Determine grid class based on feature count
	const getGridClass = (count: number) => {
		if (count <= 2) return "grid-2";
		if (count === 3) return "grid-3";
		if (count <= 4) return "grid-4";
		return "grid-6";
	};

	const gridClass = getGridClass(features.length);

	return (
		<div className="VPFeatures">
			<div className="container">
				<div className="items">
					{features.map((feature, index) => (
						<div key={index} className={`item ${gridClass}`}>
							<Feature {...feature} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function Feature({ icon, title, details, link }: FeatureConfig) {
	const content = (
		<article className="box">
			{icon && (
				<div className="icon">
					{/* Support both text icons and HTML/SVG */}
					{icon.startsWith("<") ? (
						<div dangerouslySetInnerHTML={{ __html: icon }} />
					) : (
						<span>{icon}</span>
					)}
				</div>
			)}
			<h2 className="title">{title}</h2>
			<p className="details">{details}</p>
			{link && (
				<div className="link-text">
					<span>Learn more</span>
					<svg width="14" height="14" viewBox="0 0 16 16">
						<path
							fill="currentColor"
							d="M7.28033 3.21967C6.98744 2.92678 6.51256 2.92678 6.21967 3.21967C5.92678 3.51256 5.92678 3.98744 6.21967 4.28033L8.43934 6.5H2.75C2.33579 6.5 2 6.83579 2 7.25C2 7.66421 2.33579 8 2.75 8H8.43934L6.21967 10.2197C5.92678 10.5126 5.92678 10.9874 6.21967 11.2803C6.51256 11.5732 6.98744 11.5732 7.28033 11.2803L10.7803 7.78033C11.0732 7.48744 11.0732 7.01256 10.7803 6.71967L7.28033 3.21967Z"
						/>
					</svg>
				</div>
			)}
		</article>
	);

	if (link) {
		return (
			<a className="VPFeature" href={link}>
				{content}
			</a>
		);
	}

	return <div className="VPFeature">{content}</div>;
}
