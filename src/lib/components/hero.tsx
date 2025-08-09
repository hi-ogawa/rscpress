import type { HeroConfig } from "./home";
import "./hero.css";

export function Hero(props: HeroConfig) {
	const { name, text, tagline, image, actions } = props;

	const hasImage = Boolean(image);
	const imageSrc = typeof image === "string" ? image : image?.src;
	const imageAlt = typeof image === "string" ? "" : image?.alt || "";

	return (
		<div className={`VPHero${hasImage ? " has-image" : ""}`}>
			<div className="container">
				<div className="main">
					<h1 className="heading">
						{name && <span className="name clip">{name}</span>}
						{text && <span className="text">{text}</span>}
					</h1>
					{tagline && <p className="tagline">{tagline}</p>}
					{actions && actions.length > 0 && (
						<div className="actions">
							{actions.map((action, index) => (
								<div key={index} className="action">
									<a
										className={`VPButton ${action.theme || "brand"}`}
										href={action.link}
									>
										{action.text}
									</a>
								</div>
							))}
						</div>
					)}
				</div>
				{hasImage && (
					<div className="image">
						<div className="image-container">
							<div className="image-bg"></div>
							<img className="image-src" src={imageSrc} alt={imageAlt} />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
