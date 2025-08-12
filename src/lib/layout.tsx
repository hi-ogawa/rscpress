import type React from "react";
import { Content } from "./components/content";
import { Nav } from "./components/nav";
import { Sidebar } from "./components/sidebar";

interface LayoutProps {
	children: React.ReactNode;
	layout?: "home" | "page" | "doc";
}

export function Layout(props: LayoutProps) {
	const { children, layout = "doc" } = props;

	// Determine layout configuration
	const isHome = layout === "home";
	const hasSidebar = layout === "doc";

	return (
		<div className="min-h-screen bg-gray-50">
			<Nav isHome={isHome} />
			<div className={`drawer ${hasSidebar ? "drawer-open" : ""}`}>
				{hasSidebar && <Sidebar />}
				<Content layout={layout} isHome={isHome} hasSidebar={hasSidebar}>
					{children}
				</Content>
			</div>
		</div>
	);
}
