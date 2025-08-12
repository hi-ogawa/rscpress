interface NavProps {
	isHome?: boolean;
}

export function Nav({ isHome = false }: NavProps) {
	// Use Tailwind classes for modern, clean styling
	const navClasses = `
		${
			isHome
				? "bg-transparent border-b border-transparent"
				: "bg-white border-b border-gray-200"
		} 
		fixed top-0 left-0 right-0 z-50 transition-all duration-300
	`.trim();

	return (
		<header className="relative h-16 pointer-events-none z-50">
			<nav className={navClasses}>
				<div className="px-4 sm:px-8 pointer-events-auto">
					<div className="flex justify-between items-center mx-auto max-w-7xl h-16">
						{/* Brand/Title */}
						<div className="flex-shrink-0">
							<a
								href="/"
								className="flex items-center h-16 text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors duration-200 no-underline"
							>
								RscPress
							</a>
						</div>

						{/* Navigation Content */}
						<div className="flex-1">
							<div className="flex justify-end items-center h-16">
								{/* Navigation items would go here */}
							</div>
						</div>
					</div>
				</div>

				{/* Divider for non-home pages */}
				{!isHome && (
					<div className="px-4 sm:px-8">
						<div className="w-full h-px bg-gray-200"></div>
					</div>
				)}
			</nav>
		</header>
	);
}
