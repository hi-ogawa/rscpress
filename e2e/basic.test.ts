import { expect, type Page, test } from "@playwright/test";
import { type Cli, runCli, waitForHydration } from "./helper";

test.describe("dev", () => {
	let cli: Cli;
	let url: string;
	test.beforeAll(async () => {
		cli = runCli({ command: "pnpm dev" });
		url = await cli.getServerUrl();
	});
	test.afterAll(async () => {
		cli.kill();
	});

	test("basic", async ({ page }) => {
		await page.goto(url);
		await basicTest(page);
	});
});

test.describe("build", () => {
	let cli: Cli;
	let url: string;
	test.beforeAll(async () => {
		const build = runCli({ command: "pnpm build", throwOnError: true });
		await build.done;
		cli = runCli({ command: "pnpm preview" });
		url = await cli.getServerUrl();
	});
	test.afterAll(async () => {
		cli.kill();
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
