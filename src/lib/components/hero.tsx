import { VPButton } from "./button";
import type { HeroConfig } from "./home";

export function Hero(props: HeroConfig) {
	const { name, text, tagline, image, actions } = props;

	const hasImage = Boolean(image);
	const imageSrc = typeof image === "string" ? image : image?.src;
	const imageAlt = typeof image === "string" ? "" : image?.alt || "";

	return (
		<section className="hero min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div
					className={`flex items-center justify-between ${hasImage ? "grid grid-cols-1 lg:grid-cols-2 gap-12" : "flex-col text-center"}`}
				>
					{/* Main content */}
					<div className="flex-1 max-w-2xl">
						<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8">
							{name && (
								<span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
									{name}
								</span>
							)}
							{text && <span className="block text-gray-900 mt-2">{text}</span>}
						</h1>

						{tagline && (
							<p className="text-xl text-gray-600 mb-12 max-w-xl">{tagline}</p>
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
								<div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-20 scale-110"></div>
								<img
									className="relative z-10 max-w-md w-full h-auto rounded-2xl shadow-2xl"
									src={imageSrc}
									alt={imageAlt}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
