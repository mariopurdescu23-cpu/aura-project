/**
 * Shared motion helpers.
 *
 * `prefersReducedMotion()` — the CSS media query in layout.css only neutralises
 * CSS animations and transitions. GSAP writes inline styles and drives its own
 * ticker, so it never sees that rule; every entrance tween, ScrollTrigger and
 * the Lenis smooth-scroll kept running for someone who explicitly asked their
 * OS for less motion. Components check this and jump straight to the final
 * state instead.
 *
 * `pauseWhenHidden()` — decorative loops (`repeat: -1`) keep the compositor
 * committing a frame 60 times a second forever, even when the element they
 * animate is 12000px off-screen. Measured on the idle page: 301 commits and
 * ~100ms of layerization per 5 seconds with nothing happening on screen.
 * Gating each loop on an IntersectionObserver lets the page actually go idle.
 */

let cached = null;

export function prefersReducedMotion() {
	if (typeof window === "undefined") return false;
	if (cached === null) {
		cached = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	}
	return cached;
}

/**
 * Pauses `tween` while `el` is outside the viewport (plus a margin, so the
 * animation is already running by the time it scrolls into view).
 * Returns a cleanup function.
 */
export function pauseWhenHidden(tween, el, rootMargin = "300px") {
	if (!tween || !el || typeof IntersectionObserver === "undefined") {
		return () => tween?.kill();
	}

	tween.pause();

	const io = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) tween.play();
			else tween.pause();
		},
		{ rootMargin },
	);
	io.observe(el);

	return () => {
		io.disconnect();
		tween.kill();
	};
}

/**
 * Runs `start`/`stop` as `el` enters/leaves the viewport. Same idea as
 * `pauseWhenHidden`, for things that aren't GSAP tweens (timers, intervals).
 */
export function runWhileVisible(el, start, stop, rootMargin = "200px") {
	if (!el || typeof IntersectionObserver === "undefined") {
		start();
		return () => stop();
	}

	const io = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) start();
			else stop();
		},
		{ rootMargin },
	);
	io.observe(el);

	return () => {
		io.disconnect();
		stop();
	};
}
