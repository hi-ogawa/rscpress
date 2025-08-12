import { VPButton } from "./button";
import type { HeroConfig } from "./home";

export function Hero(props: HeroConfig) {
	const { name, text, tagline, image, actions } = props;

	const hasImage = Boolean(image);
	const imageSrc = typeof image === "string" ? image : image?.src;
	const imageAlt = typeof image === "string" ? "" : image?.alt || "";

	return (
		<section
			className="hero min-h-screen flex items-center justify-center relative overflow-hidden"
			style={{ backgroundColor: "var(--vp-c-bg)" }}
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div
					className={`flex items-center justify-between ${hasImage ? "grid grid-cols-1 lg:grid-cols-2 gap-12" : "flex-col text-center"}`}
				>
					{/* Main content */}
					<div className="flex-1 max-w-2xl">
						<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8">
							{name && (
								<span
									className="block"
									style={{ color: "var(--vp-c-brand-1)" }}
								>
									{name}
								</span>
							)}
							{text && (
								<span
									className="block mt-2"
									style={{ color: "var(--vp-c-text-1)" }}
								>
									{text}
								</span>
							)}
						</h1>

						{tagline && (
							<p
								className="text-xl mb-12 max-w-xl"
								style={{ color: "var(--vp-c-text-2)" }}
							>
								{tagline}
							</p>
						)}

						{actions && actions.length > 0 && (
							<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
								{actions.map((action, index) => (
									<VPButton
										key={index}
										size="big"
										theme={action.theme || "brand"}
										text={action.text}
										href={action.link}
									/>
								))}
							</div>
						)}
					</div>

					{/* Image */}
					{hasImage && (
						<div className="flex-1 flex justify-center lg:justify-end">
							<div className="relative">
								<img
									className="relative z-10 max-w-md w-full h-auto rounded-2xl"
									src={imageSrc}
									alt={imageAlt}
									style={{ boxShadow: "var(--vp-shadow-3)" }}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
