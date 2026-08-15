<script>
	import { onMount } from "svelte";
	import gsap from "gsap";

	let cursorRef = $state();
	let labelRef = $state();
	let labelTextRef = $state();
	let isTouchDevice = $state(false);
	let isActive = $state(false);
	let labelText = $state("");

	onMount(() => {
		isTouchDevice =
			"ontouchstart" in window || navigator.maxTouchPoints > 0;

		if (isTouchDevice) return;

		gsap.set([cursorRef, labelRef], { xPercent: -50, yPercent: -50 });

		const xTo = gsap.quickTo(cursorRef, "x", { duration: 0.25, ease: "power3" }),
			yTo = gsap.quickTo(cursorRef, "y", { duration: 0.25, ease: "power3" }),
			xToLabel = gsap.quickTo(labelRef, "x", { duration: 0.35, ease: "power3" }),
			yToLabel = gsap.quickTo(labelRef, "y", { duration: 0.35, ease: "power3" });

		const moveCursor = (e) => {
			if (!isActive) {
				isActive = true;
				gsap.to(cursorRef, { autoAlpha: 1, duration: 0.3 });
			}
			xTo(e.clientX);
			yTo(e.clientY);
			xToLabel(e.clientX);
			yToLabel(e.clientY);
		};

		const handleHover = (e) => {
			const label = e.currentTarget.dataset.cursorLabel;

			if (label) {
				labelText = label;
				gsap.to(cursorRef, { autoAlpha: 0, duration: 0.2 });
				gsap.to(labelRef, {
					scale: 1,
					autoAlpha: 1,
					duration: 0.4,
					ease: "expo.out",
				});
				return;
			}

			gsap.to(cursorRef, {
				scale: 3.5,
				background: "rgba(91,33,245,0.12)",
				border: "1px solid rgba(91,33,245,0.6)",
				duration: 0.3,
				ease: "expo.out",
			});
		};

		const handleLeave = (e) => {
			if (e.currentTarget.dataset.cursorLabel) {
				gsap.to(labelRef, { scale: 0.4, autoAlpha: 0, duration: 0.3, ease: "power2.in" });
				gsap.to(cursorRef, { autoAlpha: 1, duration: 0.3 });
				return;
			}

			gsap.to(cursorRef, {
				scale: 1,
				background: "white",
				border: "0px solid transparent",
				duration: 0.3,
				ease: "expo.out",
			});
		};

		const attachEventListeners = () => {
			document
				.querySelectorAll('a, button, [contenteditable="true"], [data-cursor-label]')
				.forEach((el) => {
					if (!el.dataset.cursorBound) {
						el.addEventListener("mouseenter", handleHover);
						el.addEventListener("mouseleave", handleLeave);
						el.dataset.cursorBound = "true";
					}
				});
		};

		window.addEventListener("mousemove", moveCursor);
		attachEventListeners();

		const observer = new MutationObserver((mutations) => {
			let shouldUpdate = false;
			for (let m of mutations) {
				if (m.addedNodes.length > 0) shouldUpdate = true;
			}
			if (shouldUpdate) attachEventListeners();
		});

		observer.observe(document.body, { childList: true, subtree: true });

		return () => {
			window.removeEventListener("mousemove", moveCursor);
			observer.disconnect();
			document.querySelectorAll("a, button").forEach((el) => {
				el.removeEventListener("mouseenter", handleHover);
				el.removeEventListener("mouseleave", handleLeave);
			});
		};
	});
</script>

{#if !isTouchDevice}
	<div
		bind:this={cursorRef}
		class="fixed top-0 left-0 w-5 h-5 bg-white mix-blend-difference rounded-full pointer-events-none z-[999] opacity-0 invisible transform-gpu"
	></div>

	<div
		bind:this={labelRef}
		class="fixed top-0 left-0 flex items-center justify-center px-5 py-3 rounded-full bg-[#5B21F5] text-white pointer-events-none z-[999] opacity-0 invisible transform-gpu scale-40 whitespace-nowrap"
	>
		<span class="text-xs font-medium uppercase tracking-widest">{labelText}</span>
	</div>
{/if}
