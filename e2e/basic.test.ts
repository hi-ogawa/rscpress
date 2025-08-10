import { expect, type Page, test } from "@playwright/test";
import * as vite from "vite";
import { waitForHydration } from "./helper";

test.describe("dev", () => {
	let server: vite.ViteDevServer;
	let url: string;
	test.beforeAll(async () => {
		server = await vite.createServer();
		await server.listen();
		url = server.resolvedUrls?.local[0]!;
	});
	test.afterAll(async () => {
		await server?.close();
	});

	test("basic", async ({ page }) => {
		await page.goto(url);
		await basicTest(page);
	});
});

test.describe("build", () => {
	let server: vite.PreviewServer;
	let url: string;
	test.beforeAll(async () => {
		const builder = await vite.createBuilder();
		await builder.buildApp();
		server = await vite.preview();
		url = server.resolvedUrls?.local[0]!;
	});
	test.afterAll(async () => {
		await server?.close();
	});

	test("basic", async ({ page }) => {
		await page.goto(url);
		await basicTest(page);
	});
});

async function basicTest(page: Page) {
	await waitForHydration(page);
	await page.getByRole("link", { name: "Quickstart" }).click();
	await page.waitForURL(/\/guide\/getting-started/);
	await expect(page.locator("h1")).toContainText("Getting Started");
}
