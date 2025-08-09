import type React from "react";
import { NavBar } from "../components/navigation/nav-bar";
import { Sidebar } from "../components/navigation/sidebar";
import { TableOfContents } from "../components/content/table-of-contents";

export default function DocLayout(props: React.PropsWithChildren) {
	return (
		<div className="Layout">
			<NavBar />
			<Sidebar />
			<div className="VPContent has-sidebar">
				<div className="VPDoc has-aside">
					<div className="container">
						<TableOfContents />
						<div className="content">
							<div className="content-container">
								<main className="main">
									<div className="vp-doc">
										{props.children}
									</div>
								</main>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
