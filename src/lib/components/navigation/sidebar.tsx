export function Sidebar() {
	return (
		<aside className="VPSidebar">
			<nav>
				<div className="sidebar-group">
					<h5>Guide</h5>
					<ul className="sidebar-links">
						<li><a href="#" className="sidebar-link active">Getting Started</a></li>
						<li><a href="#" className="sidebar-link">Configuration</a></li>
						<li><a href="#" className="sidebar-link">Routing</a></li>
						<li><a href="#" className="sidebar-link">Markdown</a></li>
						<li><a href="#" className="sidebar-link">Asset Handling</a></li>
					</ul>
				</div>
				
				<div className="sidebar-group">
					<h5>Reference</h5>
					<ul className="sidebar-links">
						<li><a href="#" className="sidebar-link">Site Config</a></li>
						<li><a href="#" className="sidebar-link">Frontmatter Config</a></li>
						<li><a href="#" className="sidebar-link">Runtime API</a></li>
						<li><a href="#" className="sidebar-link">CLI</a></li>
					</ul>
				</div>
			</nav>
		</aside>
	);
}