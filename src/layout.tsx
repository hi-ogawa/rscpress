import type React from "react";
import { Content } from "./components/content";
import { Nav } from "./components/nav";
import { Sidebar } from "./components/sidebar";
import "./layout.css";

interface LayoutProps {
	children: React.ReactNode;
	layout?: "home" | "page" | "doc";
}

export function Layout(props: LayoutProps) {
	const { children, layout = "doc" } = props;

	// Determine layout classes like VitePress
	const isHome = layout === "home";
	const hasSidebar = layout === "doc"; // TODO: Add proper sidebar detection logic

	return (
		<div className="Layout">
			<Nav isHome={isHome} />
			{hasSidebar && <Sidebar />}
			<Content layout={layout} isHome={isHome} hasSidebar={hasSidebar}>
				{children}
			</Content>
		</div>
	);
}
