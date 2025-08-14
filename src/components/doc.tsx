import type React from "react";
import { DocAsideOutline } from "./doc-aside-outline";
import "./doc.css";

export function Doc(props: React.PropsWithChildren) {
	return (
		<div className="VPDoc has-aside">
			<div className="container">
				<DocAsideOutline />
				<div className="content">
					<div className="content-container">
						<main className="main">
							<div className="vp-doc">{props.children}</div>
						</main>
					</div>
				</div>
			</div>
		</div>
	);
}
