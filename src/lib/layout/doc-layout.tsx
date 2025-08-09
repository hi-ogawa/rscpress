import type React from "react";

export default function DocLayout(props: React.PropsWithChildren) {
	return (
		<div>
			<h1>RSCPress Documentation</h1>
			{props.children}
			<footer>
				<p>© 2023 RSCPress</p>
			</footer>
		</div>
	);
}
