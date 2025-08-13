import * as ReactServer from "@vitejs/plugin-rsc/rsc";
import type { RscPayload } from "@vitejs/plugin-rsc/rsc-Cv3XEZqB";
import { getStaticPaths, Root } from "../root.tsx";
import { RSC_POSTFIX } from "./shared.ts";

export { getStaticPaths };

export default async function handler(request: Request): Promise<Response> {
	let url = new URL(request.url);
	let isRscRequest = false;
	if (url.pathname.endsWith(RSC_POSTFIX)) {
		isRscRequest = true;
		url.pathname = url.pathname.slice(0, -RSC_POSTFIX.length);
	}

	const rscPayload: RscPayload = { root: <Root url={url} /> };
	const rscStream = ReactServer.renderToReadableStream<RscPayload>(rscPayload);

	if (isRscRequest) {
		return new Response(rscStream, {
			headers: {
				"content-type": "text/x-component;charset=utf-8",
				vary: "accept",
			},
		});
	}

	const ssr = await loadSsrModule();
	const htmlStream = await ssr.renderHTML(rscStream, {
		debugNojs: url.searchParams.has("__nojs"),
	});

	return new Response(htmlStream, {
		headers: {
			"content-type": "text/html;charset=utf-8",
			vary: "accept",
		},
	});
}

// separate API to render both streams at once for ssg
export async function handleSsg(request: Request): Promise<{
	html: ReadableStream<Uint8Array>;
	rsc: ReadableStream<Uint8Array>;
}> {
	const url = new URL(request.url);
	const rscPayload: RscPayload = { root: <Root url={url} /> };
	const rscStream = ReactServer.renderToReadableStream<RscPayload>(rscPayload);
	const [rscStream1, rscStream2] = rscStream.tee();

	const ssr = await loadSsrModule();
	const htmlStream = await ssr.renderHTML(rscStream1, {
		ssg: true,
	});

	return { html: htmlStream, rsc: rscStream2 };
}

function loadSsrModule() {
	return import.meta.viteRsc.loadModule<typeof import("./entry.ssr")>(
		"ssr",
		"index",
	);
}

if (import.meta.hot) {
	import.meta.hot.accept();
}
