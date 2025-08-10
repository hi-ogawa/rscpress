import { expect, type Page } from "@playwright/test";

export async function waitForHydration(page: Page, locator: string = "body") {
	await expect
		.poll(
			() =>
				page
					.locator(locator)
					.evaluate(
						(el) =>
							el &&
							Object.keys(el).some((key) => key.startsWith("__reactFiber")),
					),
			{ timeout: 10000 },
		)
		.toBeTruthy();
}
