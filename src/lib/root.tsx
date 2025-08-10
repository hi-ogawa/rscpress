import "./styles/index.css";
import { Layout } from "./layout";
import { Home } from "./components/home";
import routeModules from "virtual:rscpress:routes";

// TODO: ssg 404
export async function getStaticPaths(): Promise<string[]> {
	return Object.keys(routeModules);
}

export async function Root({ url }: { url: URL }) {
	let content: React.ReactNode;
	const routeModuleFn = routeModules[url.pathname];
	if (!routeModuleFn) {
		content = <div>Not found</div>;
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
			<body>{content}</body>
		</html>
	);
}
