import "./doc-aside-outline.css";

type OutlineItem = {
	text: string;
	link: string;
	level?: number;
};

const outlineItems: OutlineItem[] = [
	{ text: "Try It Online", link: "#try-it-online" },
	{ text: "Installation", link: "#installation" },
	{ text: "File Structure", link: "#file-structure" },
	{ text: "Up and Running", link: "#up-and-running" },
	{ text: "What's Next?", link: "#whats-next" },
];

function OutlineLink({ item }: { item: OutlineItem }) {
	return (
		<li className="outline-item">
			<a href={item.link} className="outline-link">
				{item.text}
			</a>
		</li>
	);
}

export function DocAsideOutline() {
	return (
		<div className="aside">
			<div className="aside-container">
				<div className="aside-content">
					<nav className="outline">
						<div className="outline-title">On this page</div>
						<ul className="outline-list">
							{outlineItems.map((item, index) => (
								<OutlineLink key={index} item={item} />
							))}
						</ul>
					</nav>
				</div>
			</div>
		</div>
	);
}
