import "./sidebar.css";

export function Sidebar() {
	return (
		<aside className="VPSidebar">
			<nav>
				<div className="sidebar-group">
					<h5>Introduction</h5>
					<ul className="sidebar-links">
						<li>
							<a href="/guide/getting-started" className="sidebar-link active">
								Getting Started
							</a>
						</li>
						<li>
							<a href="#" className="sidebar-link">
								Configuration
							</a>
						</li>
						<li>
							<a href="#" className="sidebar-link">
								Routing
							</a>
						</li>
						<li>
							<a href="#" className="sidebar-link">
								Markdown
							</a>
						</li>
						<li>
							<a href="#" className="sidebar-link">
								Asset Handling
							</a>
						</li>
					</ul>
				</div>

				<div className="sidebar-group">
					<h5>Reference</h5>
					<ul className="sidebar-links">
						<li>
							<a href="#" className="sidebar-link">
								Site Config
							</a>
						</li>
						<li>
							<a href="/guide/frontmatter" className="sidebar-link">
								Frontmatter
							</a>
						</li>
						<li>
							<a href="#" className="sidebar-link">
								Runtime API
							</a>
						</li>
						<li>
							<a href="#" className="sidebar-link">
								CLI
							</a>
						</li>
					</ul>
				</div>
			</nav>
		</aside>
	);
}
