import * as ReactClient from "@vitejs/plugin-rsc/browser";
import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { rscStream } from "rsc-html-stream/client";
import { RSC_POSTFIX, type RscPayload } from "./shared";
import { fromBase64 } from "./utils";

// TODO: scroll restoration
// TODO: vite transition

async function main() {
	async function onNavigation() {
		const url = new URL(window.location.href);
		url.pathname = url.pathname + RSC_POSTFIX;
		const response = await fetch(url, {
			headers: {
				accept: "text/x-component",
			},
		});
		let stream = response.ok && response.body;
		if (response.status === 404 && globalThis.__rscpress_ssg) {
			// use ssg-ed 404 payload on production
			const ssgData = globalThis.__rscpress_ssg;
			stream = new ReadableStream({
				start(controller) {
					controller.enqueue(fromBase64(ssgData.notFound));
					controller.close();
				},
			});
		} else if (!response.ok || !stream) {
			// TODO: handle network error etc...
			return;
		}
		const payload =
			await ReactClient.createFromReadableStream<RscPayload>(stream);
		setPayload(payload);
	}

	const initialPayload =
		await ReactClient.createFromReadableStream<RscPayload>(rscStream);

	let setPayload: (v: RscPayload) => void;

	function BrowserRoot() {
		const [payload, setPayload_] = React.useState(initialPayload);

		React.useEffect(() => {
			setPayload = (v) => React.startTransition(() => setPayload_(v));
		}, [setPayload_]);

		React.useEffect(() => {
			// TODO: scroll restoration
			history.scrollRestoration = "manual";

			return listenNavigation(() => onNavigation());
		}, []);

		return payload.root;
	}

	const browserRoot = (
		<React.StrictMode>
			<BrowserRoot />
		</React.StrictMode>
	);

	ReactDOMClient.hydrateRoot(document, browserRoot);

	if (import.meta.hot) {
		import.meta.hot.on("rsc:update", () => {
			window.history.replaceState({}, "", window.location.href);
		});
	}
}

// a little helper to setup events interception for client side navigation
function listenNavigation(onNavigation: () => void) {
	window.addEventListener("popstate", onNavigation);

	const oldPushState = window.history.pushState;
	window.history.pushState = function (...args) {
		const res = oldPushState.apply(this, args);
		onNavigation();
		return res;
	};

	const oldReplaceState = window.history.replaceState;
	window.history.replaceState = function (...args) {
		const res = oldReplaceState.apply(this, args);
		onNavigation();
		return res;
	};

	function onClick(e: MouseEvent) {
		let link = (e.target as Element).closest("a");
		if (
			link &&
			link instanceof HTMLAnchorElement &&
			link.href &&
			(!link.target || link.target === "_self") &&
			link.origin === location.origin &&
			!link.hasAttribute("download") &&
			e.button === 0 && // left clicks only
			!e.metaKey && // open in new tab (mac)
			!e.ctrlKey && // open in new tab (windows)
			!e.altKey && // download
			!e.shiftKey &&
			!e.defaultPrevented
		) {
			e.preventDefault();
			history.pushState(null, "", link.href);
		}
	}
	document.addEventListener("click", onClick);

	return () => {
		document.removeEventListener("click", onClick);
		window.removeEventListener("popstate", onNavigation);
		window.history.pushState = oldPushState;
		window.history.replaceState = oldReplaceState;
	};
}

main();
