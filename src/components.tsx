import type React from "react";

export function CodeGroup(props: {
	blocks: Record<string, React.ReactNode>;
	children?: React.ReactNode;
}) {
	console.log(props.blocks);
	return (
		<div>
			TODO: CodeGroup
			<div>{props.children}</div>
		</div>
	);
}

export function TestBuiltin(props: { test: string }) {
	return <div>test-build: {props.test}</div>;
}
