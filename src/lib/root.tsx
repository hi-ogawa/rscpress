import "./styles/index.css";
import { Layout } from "./layout";
import { Home, type HeroConfig, type FeatureConfig } from "./components/home";
import * as Index from "../example/index.md?mdx";
import Guide from "../example/guide/getting-started.md?mdx";

export async function Root({ url }: { url: URL }) {
	let content: React.ReactNode;
	if (url.pathname === "/") {
		const { hero, features } = Index.frontmatter as {
			hero?: HeroConfig;
			features?: FeatureConfig[];
		};
		content = (
			<Layout layout="home">
				<Home hero={hero} features={features} />
			</Layout>
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
