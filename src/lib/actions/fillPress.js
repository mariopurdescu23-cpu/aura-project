/**
 * Svelte action: sweeps a purple "fill" out from the point pressed/tapped
 * (paired with the `.btn-fill` CSS in layout.css), so buttons that used to
 * rely on CSS :hover for their purple accent get real, visible feedback on
 * touch — the fill grows to cover the button and the label turns white,
 * then releases back after `hold` ms.
 *
 * Usage: <a class="btn-fill ..." use:fillPress>Label</a>
 */
export function fillPress(node, options = {}) {
	const hold = options.hold ?? 1100;
	node.classList.add("btn-fill");
	let timer;

	function trigger(x, y) {
		const rect = node.getBoundingClientRect();
		const px = rect.width ? ((x - rect.left) / rect.width) * 100 : 50;
		const py = rect.height ? ((y - rect.top) / rect.height) * 100 : 50;
		node.style.setProperty("--fill-x", `${px}%`);
		node.style.setProperty("--fill-y", `${py}%`);
		node.classList.add("is-filled");
		clearTimeout(timer);
		timer = setTimeout(() => node.classList.remove("is-filled"), hold);
	}

	function handlePointerDown(e) {
		trigger(e.clientX, e.clientY);
	}

	function handleKeyDown(e) {
		if (e.key === "Enter" || e.key === " ") {
			const rect = node.getBoundingClientRect();
			trigger(rect.left + rect.width / 2, rect.top + rect.height / 2);
		}
	}

	node.addEventListener("pointerdown", handlePointerDown);
	node.addEventListener("keydown", handleKeyDown);

	return {
		destroy() {
			node.removeEventListener("pointerdown", handlePointerDown);
			node.removeEventListener("keydown", handleKeyDown);
			clearTimeout(timer);
		},
	};
}
