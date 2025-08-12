interface ButtonProps {
	size?: "medium" | "big";
	theme?: "brand" | "alt" | "sponsor";
	text?: string;
	href?: string;
	target?: string;
	rel?: string;
	children?: React.ReactNode;
}

export function VPButton({
	size = "medium",
	theme = "brand",
	text,
	href,
	target,
	rel,
	children,
}: ButtonProps) {
	// Use VitePress-compatible styling with only color transitions
	const baseClasses =
		"btn inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none";

	const sizeClasses = {
		medium: "px-6 py-3 text-base",
		big: "px-8 py-4 text-lg",
	};

	const themeClasses = {
		brand: "btn-brand",
		alt: "btn-alt",
		sponsor: "btn-sponsor",
	};

	const buttonClasses = [
		baseClasses,
		sizeClasses[size],
		themeClasses[theme],
	].join(" ");

	// Determine if it's an external link
	const isExternal = href && /^https?:\/\//.test(href);

	// Auto-set target and rel for external links
	const finalTarget = target ?? (isExternal ? "_blank" : undefined);
	const finalRel = rel ?? (isExternal ? "noreferrer" : undefined);

	if (href) {
		return (
			<a
				className={buttonClasses}
				href={href}
				target={finalTarget}
				rel={finalRel}
			>
				{children ?? text}
			</a>
		);
	}

	return (
		<button className={buttonClasses} type="button">
			{children ?? text}
		</button>
	);
}
