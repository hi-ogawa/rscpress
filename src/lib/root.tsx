import "./styles/index.css";
import { Layout } from "./layout";
import Page from "../example/guide/getting-started.md?mdx";

export async function Root() {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<link rel="icon" type="image/svg+xml" href="/vite.svg" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Vite + RSC</title>
			</head>
			<body>
				<Layout layout="doc">
					<Page />
				</Layout>
			</body>
		</html>
	);
}
