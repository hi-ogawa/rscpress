import type React from "react";
import { Nav } from "./components/nav";
import { Sidebar } from "./components/sidebar";
import { Content } from "./components/content";
import "./layout.css";

interface LayoutProps {
	children: React.ReactNode;
	layout?: "home" | "page" | "doc";
}

export function Layout(props: LayoutProps) {
	const { children, layout = "doc" } = props;

	return (
		<div className="Layout">
			<Nav />
			{layout === "doc" && (
				<>
					<Sidebar />
					<Content layout={layout}>{children}</Content>
				</>
			)}
			{layout === "home" && children}
		</div>
	);
}
