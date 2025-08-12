import "./styles.css"
import "./styles/index.css";
import routeModules from "virtual:rscpress:routes";
import { Client } from "./client";
import { Home } from "./components/home";
import { NotFound } from "./components/not-found";
import { Layout } from "./layout";

export async function getStaticPaths(): Promise<string[]> {
	const paths = Object.keys(routeModules);
	return [...paths, "404"];
}

export async function Root({ url }: { url: URL }) {
	let content: React.ReactNode;
	const routeModuleFn = routeModules[url.pathname];
	if (!routeModuleFn) {
		content = (
			<Layout layout="home">
				<NotFound />
			</Layout>
		);
	} else {
		const routeModule = await routeModuleFn();
		const layout = routeModule.frontmatter?.layout || "doc";
		if (layout == "home") {
			const { hero, features } = routeModule.frontmatter ?? {};
			content = (
				<Layout layout="home">
					<Home hero={hero} features={features}>
						<routeModule.default />
					</Home>
				</Layout>
			);
		} else {
			content = (
				<Layout layout={layout}>
					<routeModule.default />
				</Layout>
			);
		}
	}

	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<link rel="icon" type="image/svg+xml" href="/vite.svg" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Vite + RSC</title>
			</head>
			<body>
				{content}
				<Client />
			</body>
		</html>
	);
}
