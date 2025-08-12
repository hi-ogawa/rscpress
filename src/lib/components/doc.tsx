import type React from "react";
import { DocAsideOutline } from "./doc-aside-outline";

export function Doc(props: React.PropsWithChildren) {
	return (
		<div className="flex max-w-8xl mx-auto">
			{/* Main content */}
			<div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<main className="py-8">
					<article className="prose prose-lg max-w-none">
						{props.children}
					</article>
				</main>
			</div>

			{/* Table of contents aside */}
			<DocAsideOutline />
		</div>
	);
}
