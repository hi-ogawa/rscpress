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

export function CustomContainer(props: {
	className?: string;
	title?: string;
	children?: React.ReactNode;
}) {
	return (
		<div className={cls("custom-block", props.className)}>
			<p className="custom-block-title">{props.title}</p>
			{props.children}
		</div>
	);
}

const cls = (...args: any[]) => args.filter(Boolean).join(" ");
