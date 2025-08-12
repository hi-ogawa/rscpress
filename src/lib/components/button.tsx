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
	// Use Tailwind utility classes for modern styling
	const baseClasses =
		"inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

	const sizeClasses = {
		medium: "px-6 py-3 text-base",
		big: "px-8 py-4 text-lg",
	};

	const themeClasses = {
		brand:
			"bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl",
		alt: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300",
		sponsor:
			"bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 focus:ring-pink-500 shadow-lg hover:shadow-xl",
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
