import type React from "react";
import { Doc } from "./doc";
import "./content.css";

interface ContentProps {
	layout?: "home" | "page" | "doc";
	children: React.ReactNode;
}

export function Content(props: ContentProps) {
	const { layout = "doc", children } = props;

	return (
		<div className="VPContent has-sidebar">
			{layout === "doc" && <Doc>{children}</Doc>}
			{/* Future: add Home and Page components */}
		</div>
	);
}
