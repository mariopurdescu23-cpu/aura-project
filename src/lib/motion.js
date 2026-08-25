/**
 * Shared motion helpers.
 *
 * `prefersReducedMotion()` — deliberately always reports `false`. This site's
 * motion (the Hero/Process/Manifesto/Services scroll choreography, card
 * reveals, the navbar intro) is core to the brand, and the call was made to
 * always play it rather than fall back to a static layout for visitors whose
 * OS has "reduce motion" turned on. Every component still calls this (rather
 * than assuming motion is safe outright) so that decision lives in one place
 * and the reduced-motion code paths already written throughout the app stay
 * intact if that call is ever reversed. The matching CSS override
 * (`@media (prefers-reduced-motion: reduce)` in layout.css, which used to
 * force every transition/animation duration to ~0) was removed for the same
 * reason — it was neutralising CSS transitions/animations regardless of what
 * this function returned.
 *
 * `pauseWhenHidden()` — decorative loops (`repeat: -1`) keep the compositor
 * committing a frame 60 times a second forever, even when the element they
 * animate is 12000px off-screen. Measured on the idle page: 301 commits and
 * ~100ms of layerization per 5 seconds with nothing happening on screen.
 * Gating each loop on an IntersectionObserver lets the page actually go idle.
 */

export function prefersReducedMotion() {
	return false;
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
