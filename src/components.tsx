import React from "react";

export function CodeGroup(props: {
	id: string;
	titles: string[];
	children?: React.ReactNode;
}) {
	return (
		<div className="code-group">
			<div className="tabs">
				{props.titles.map((title, i) => (
					<React.Fragment key={i}>
						<input
							type="radio"
							name={`group-${props.id}`}
							id={`group-${props.id}:${i}`}
							value={i}
							defaultChecked={i === 0}
						/>
						<label htmlFor={`group-${props.id}:${i}`}>{title}</label>
					</React.Fragment>
				))}
			</div>
			<div className="blocks">{props.children}</div>
		</div>
	);
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
