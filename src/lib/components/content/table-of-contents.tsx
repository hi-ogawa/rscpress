export function TableOfContents() {
	return (
		<div className="aside">
			<div className="aside-container">
				<div className="aside-content">
					<nav className="outline">
						<div className="outline-title">On this page</div>
						<ul className="outline-list">
							<li className="outline-item">
								<a href="#try-it-online" className="outline-link">Try It Online</a>
							</li>
							<li className="outline-item">
								<a href="#installation" className="outline-link">Installation</a>
							</li>
							<li className="outline-item">
								<a href="#file-structure" className="outline-link">File Structure</a>
							</li>
							<li className="outline-item">
								<a href="#up-and-running" className="outline-link">Up and Running</a>
							</li>
							<li className="outline-item">
								<a href="#whats-next" className="outline-link">What's Next?</a>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
	);
}