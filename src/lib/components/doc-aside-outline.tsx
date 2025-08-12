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
		<li>
			<a
				href={item.link}
				className="block py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 border-l-2 border-transparent hover:border-gray-300 pl-3"
			>
				{item.text}
			</a>
		</li>
	);
}

export function DocAsideOutline() {
	return (
		<aside className="hidden xl:block w-64 flex-shrink-0">
			<div className="sticky top-20 py-8 pr-8">
				<nav>
					<h4 className="text-sm font-semibold text-gray-900 mb-4">
						On this page
					</h4>
					<ul className="space-y-2">
						{outlineItems.map((item, index) => (
							<OutlineLink key={index} item={item} />
						))}
					</ul>
				</nav>
			</div>
		</aside>
	);
}
