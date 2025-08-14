import "virtual:rscpress:code-title-icon.css";
import { icons } from "virtual:rscpress:code-title-icon";
import { sortBy } from "@hiogawa/utils";

export function getCodeTitleIconLabel(title: string) {
	let keys = Object.keys(icons);
	keys = keys.filter((key) => title.includes(key));
	return sortBy(keys, (key) => -key.length)[0];
}
