import { type SpawnOptions, spawn } from "node:child_process";
import { stripVTControlCharacters, styleText } from "node:util";
import { expect, type Page } from "@playwright/test";
import { x } from "tinyexec";

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

export type Cli = ReturnType<typeof runCli>;

export function runCli(
	options: {
		command: string;
		label?: string;
		throwOnError?: boolean;
	} & SpawnOptions,
) {
	const [name, ...args] = options.command.split(" ");
	const child = x(name!, args, { nodeOptions: options }).process!;
	const label = `[${options.label ?? "cli"}]`;
	let stdout = "";
	let stderr = "";
	child.stdout!.on("data", (data) => {
		stdout += stripVTControlCharacters(String(data));
		if (process.env.TEST_DEBUG) {
			console.log(styleText("cyan", label), data.toString());
		}
	});
	child.stderr!.on("data", (data) => {
		stderr += stripVTControlCharacters(String(data));
		console.log(styleText("magenta", label), data.toString());
	});
	const done = new Promise<void>((resolve, reject) => {
		child.on("exit", (code) => {
			if (code !== 0 && code !== 143 && process.platform !== "win32") {
				console.log(styleText("magenta", `${label}`), `exit code ${code}`);
			}
			if (options.throwOnError && code !== 0) {
				reject(
					new Error(`${label} exited with code ${code}\n${stdout}\n${stderr}`),
				);
				return;
			}
			resolve();
		});
	});

	async function getServerUrl(): Promise<string> {
		let stdout = "";
		return new Promise((resolve) => {
			child.stdout!.on("data", (data) => {
				stdout += stripVTControlCharacters(String(data));
				const match = stdout.match(/http:\/\/localhost:(\d+)/);
				if (match) {
					resolve("http://localhost:" + match[1]);
				}
			});
		});
	}

	// TODO: zombie?
	function kill() {
		if (process.platform === "win32") {
			spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"]);
		} else {
			child.kill();
		}
	}

	return {
		proc: child,
		done,
		getServerUrl,
		kill,
		stdout: () => stdout,
		stderr: () => stderr,
	};
}
