"use client";

import React from "react";

export function Client() {
	React.useEffect(() => {
		return setupCodeGroups();
	});
	return null;
}

function setupCodeGroups() {
	function onClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.matches(".vp-code-group .tabs label")) return;

		const group = target.closest(".vp-code-group");
		if (!group) return;

		const labels = Array.from(group.querySelectorAll(".tabs label"));
		const activeIndex = labels.indexOf(target);

		group.querySelectorAll(".code-group-block").forEach((block, index) => {
			if (index === activeIndex) {
				block.classList.add("active");
			} else {
				block.classList.remove("active");
			}
		});

		e.preventDefault();
	}

	document.addEventListener("click", onClick);
	return () => {
		document.removeEventListener("click", onClick);
	};
}
