import "./sidebar.css";

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
				className={`sidebar-link ${isActive ? "active" : ""}`}
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
		<div className="sidebar-group">
			{item.text && <h5>{item.text}</h5>}
			<ul className="sidebar-links">
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
		<aside className="VPSidebar">
			<nav>
				{sidebarConfig.map((item, index) => (
					<SidebarGroup key={index} item={item} />
				))}
			</nav>
		</aside>
	);
}
