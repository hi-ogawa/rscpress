import type React from "react";
import { Doc } from "./doc";

interface ContentProps {
	layout?: "home" | "page" | "doc";
	isHome: boolean;
	hasSidebar: boolean;
	children: React.ReactNode;
}

export function Content(props: ContentProps) {
	const { layout = "doc", isHome, hasSidebar, children } = props;

	// Use Tailwind classes for responsive and clean layout
	const contentClasses = `
		flex-1 min-h-screen
		${hasSidebar ? "lg:ml-64" : ""}
		${isHome ? "pt-0" : "pt-16"}
		transition-all duration-300
	`.trim();

	return (
		<main className={contentClasses}>
			{layout === "home" && children}
			{layout === "doc" && <Doc>{children}</Doc>}
			{/* Future: add Page component */}
		</main>
	);
}
