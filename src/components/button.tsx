import "./button.css";

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
	// Build CSS classes like VitePress
	const buttonClasses = ["VPButton", size, theme].join(" ");

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
