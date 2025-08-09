import "./styles/index.css";
import { Layout } from "./layout";
import * as Home from "../example/index.md?mdx";
import Guide from "../example/guide/getting-started.md?mdx";

export async function Root(props: { request: Request }) {
	const url = new URL(props.request.url);
	let content: React.ReactNode;
	if (url.pathname === "/") {
		console.log(Home.frontmatter);
		content = (
			<div>
				<h1>Hom</h1>
				<a href="/guide/getting-started">Guide</a>
			</div>
		);
	} else {
		content = (
			<Layout layout="doc">
				<Guide />
			</Layout>
		);
	}

	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<link rel="icon" type="image/svg+xml" href="/vite.svg" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Vite + RSC</title>
			</head>
			<body>{content}</body>
		</html>
	);
}
