import type { FeatureConfig } from "./home";

export interface FeaturesProps {
	features: FeatureConfig[];
}

export function Features({ features }: FeaturesProps) {
	// Responsive grid based on feature count
	const getGridClass = (count: number) => {
		if (count <= 2) return "md:grid-cols-2";
		if (count === 3) return "md:grid-cols-3";
		if (count <= 4) return "md:grid-cols-2 lg:grid-cols-4";
		return "md:grid-cols-2 lg:grid-cols-3";
	};

	const gridClass = getGridClass(features.length);

	return (
		<section className="py-20" style={{ backgroundColor: "var(--vp-c-bg)" }}>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className={`grid grid-cols-1 ${gridClass} gap-8`}>
					{features.map((feature, index) => (
						<Feature key={index} {...feature} />
					))}
				</div>
			</div>
		</section>
	);
}

function Feature({ icon, title, details, link }: FeatureConfig) {
	const content = (
		<div className="card h-full">
			<div className="card-body p-8 text-center">
				{icon && (
					<div className="flex justify-center mb-6">
						<div
							className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
							style={{
								backgroundColor: "var(--vp-c-brand-soft)",
								color: "var(--vp-c-brand-1)",
							}}
						>
							{/* Support both text icons and HTML/SVG */}
							{icon.startsWith("<") ? (
								<div dangerouslySetInnerHTML={{ __html: icon }} />
							) : (
								<span>{icon}</span>
							)}
						</div>
					</div>
				)}
				<h3
					className="text-xl font-bold mb-4"
					style={{ color: "var(--vp-c-text-1)" }}
				>
					{title}
				</h3>
				<p
					className="mb-6 leading-relaxed"
					style={{ color: "var(--vp-c-text-2)" }}
				>
					{details}
				</p>
				{link && (
					<div
						className="flex items-center justify-center font-medium transition-colors"
						style={{ color: "var(--vp-c-brand-1)" }}
					>
						<span>Learn more</span>
						<svg
							className="ml-2 w-4 h-4"
							fill="currentColor"
							viewBox="0 0 16 16"
						>
							<path d="M7.28033 3.21967C6.98744 2.92678 6.51256 2.92678 6.21967 3.21967C5.92678 3.51256 5.92678 3.98744 6.21967 4.28033L8.43934 6.5H2.75C2.33579 6.5 2 6.83579 2 7.25C2 7.66421 2.33579 8 2.75 8H8.43934L6.21967 10.2197C5.92678 10.5126 5.92678 10.9874 6.21967 11.2803C6.51256 11.5732 6.98744 11.5732 7.28033 11.2803L10.7803 7.78033C11.0732 7.48744 11.0732 7.01256 10.7803 6.71967L7.28033 3.21967Z" />
						</svg>
					</div>
				)}
			</div>
		</div>
	);

	if (link) {
		return (
			<a href={link} className="block transition-colors">
				{content}
			</a>
		);
	}

	return <div>{content}</div>;
}
