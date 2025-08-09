import "./styles/index.css";
import DocLayout from "./layout/doc-layout.tsx";
import Page from "./example/guide/getting-started.tsx";

export function Root() {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<link rel="icon" type="image/svg+xml" href="/vite.svg" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Vite + RSC</title>
			</head>
			<body>
				<DocLayout>
					<Page />
				</DocLayout>
			</body>
		</html>
	);
}
