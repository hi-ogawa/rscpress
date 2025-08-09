import type React from "react";
import { NavBar } from "../components/nav-bar";
import { Sidebar } from "../components/sidebar";
import { TableOfContents } from "../components/table-of-contents";
import './doc-layout.css';

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
