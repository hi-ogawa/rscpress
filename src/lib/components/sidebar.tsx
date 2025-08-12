type SidebarItem = {
	text?: string;
	link?: string;
	items?: SidebarItem[];
	collapsed?: boolean;
};

type SidebarGroup = {
	text?: string;
	items: SidebarItem[];
	collapsed?: boolean;
};

const sidebarConfig: SidebarItem[] = [
	{
		text: "Introduction",
		collapsed: false,
		items: [
			{ text: "What is RSCPress?", link: "/guide/what-is-rscpress" },
			{ text: "Getting Started", link: "/guide/getting-started" },
			{ text: "Routing", link: "/guide/routing" },
			{ text: "Deploy", link: "/guide/deploy" },
		],
	},
	{
		text: "Writing",
		collapsed: false,
		items: [
			{ text: "Markdown Extensions", link: "/guide/markdown" },
			{ text: "Asset Handling", link: "/guide/asset-handling" },
			{ text: "Frontmatter", link: "/guide/frontmatter" },
			{ text: "Using React in Markdown", link: "/guide/using-react" },
			{ text: "Internationalization", link: "/guide/i18n" },
		],
	},
];

function SidebarItem({
	item,
	isActive,
}: {
	item: SidebarItem;
	isActive?: boolean;
}) {
	return (
		<li>
			<a
				href={item.link}
				className={`block px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
					isActive
						? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
						: "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
				}`}
			>
				{item.text}
			</a>
		</li>
	);
}

function SidebarGroup({ item }: { item: SidebarItem }) {
	if (!item.items) {
		return (
			<SidebarItem
				item={item}
				isActive={item.link === "/guide/getting-started"}
			/>
		);
	}

	return (
		<div className="mb-6">
			{item.text && (
				<h5 className="px-3 mb-3 text-xs font-semibold text-gray-900 uppercase tracking-wider">
					{item.text}
				</h5>
			)}
			<ul className="space-y-1">
				{item.items.map((subItem, index) => (
					<SidebarItem
						key={index}
						item={subItem}
						isActive={subItem.link === "/guide/getting-started"}
					/>
				))}
			</ul>
		</div>
	);
}

export function Sidebar() {
	return (
		<aside className="drawer-side">
			<div className="w-64 min-h-screen bg-white border-r border-gray-200">
				<nav className="p-4 pt-20">
					{sidebarConfig.map((item, index) => (
						<SidebarGroup key={index} item={item} />
					))}
				</nav>
			</div>
		</aside>
	);
}
