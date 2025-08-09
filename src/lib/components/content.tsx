import type React from "react";
import { Doc } from "./doc";
import "./content.css";

interface ContentProps {
	layout?: "home" | "page" | "doc";
	isHome: boolean;
	hasSidebar: boolean;
	children: React.ReactNode;
}

export function Content(props: ContentProps) {
	const { layout = "doc", isHome, hasSidebar, children } = props;

	// Build VitePress-style CSS classes
	const contentClasses = [
		"VPContent",
		isHome && "is-home",
		hasSidebar && "has-sidebar",
	].filter(Boolean).join(" ");

	return (
		<div className={contentClasses}>
			{layout === "home" && children}
			{layout === "doc" && <Doc>{children}</Doc>}
			{/* Future: add Page component */}
		</div>
	);
}
