import React from "react";
import { getCodeTitleIcon } from "./plugins/code-title-icon/utils";

export function CodeGroup(props: {
	id: string;
	titles: string[];
	children?: React.ReactNode;
}) {
	return (
		<div className="vp-code-group">
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
						<label
							htmlFor={`group-${props.id}:${i}`}
							data-title={getCodeTitleIcon(title)}
						>
							{title}
						</label>
					</React.Fragment>
				))}
			</div>
			<div className="blocks">{props.children}</div>
		</div>
	);
}

export function CustomContainer(props: {
	title?: string;
	type?: string;
	github?: boolean;
	children?: React.ReactNode;
}) {
	return (
		<div
			className={cls(
				"custom-block",
				props.type,
				props.github && "github-alert",
			)}
		>
			<p className="custom-block-title">{props.title}</p>
			{props.children}
		</div>
	);
}

const cls = (...args: any[]) => args.filter(Boolean).join(" ");

export function CodeBlock(props: {
	lang: string;
	title: string;
	children?: React.ReactNode;
}) {
	const { lang, title } = props;
	let node = (
		<div
			className={cls(
				`language-${lang}`,
				title.startsWith("code-group:") && "code-group-block",
				title.startsWith("code-group:0:") && "active",
			)}
		>
			<button className="copy"></button>
			<span className="lang">{lang}</span>
			{props.children}
		</div>
	);

	if (title && !title.startsWith("code-group:")) {
		node = (
			<div className="vp-code-block-title">
				<div className="vp-code-block-title-bar">
					<span
						className="vp-code-block-title-text"
						data-title={getCodeTitleIcon(title)}
					>
						{title}
					</span>
				</div>
				{node}
			</div>
		);
	}

	return node;
}
