import "./nav.css";

interface NavProps {
	isHome?: boolean;
}

export function Nav({ isHome = false }: NavProps) {
	// Build CSS classes like VitePress
	const navBarClasses = [
		"VPNavBar",
		isHome && "home",
		"top", // TODO: Add scroll detection for dynamic top class
	]
		.filter(Boolean)
		.join(" ");

	return (
		<header className="VPNav">
			<div className={navBarClasses}>
				<div className="wrapper">
					<div className="container">
						<div className="title">
							<a href="/">RscPress</a>
						</div>
						<div className="content">
							<div className="content-body">
								{/* Navigation content would go here */}
							</div>
						</div>
					</div>
				</div>
				<div className="divider">
					<div className="divider-line"></div>
				</div>
			</div>
		</header>
	);
}
