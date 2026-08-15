import { prefersReducedMotion } from "./motion.js";

/**
 * Anchor navigation ("go to that section" from the navbar / buttons).
 *
 * This used to be `gsap.to(window, { duration: 2.2, scrollTo: ..., ease: "power3.inOut" })`,
 * which had two problems, both measured:
 *
 * 1. The duration was FIXED at 2.2s no matter how far the jump was. Clicking
 *    "About" from the top of the page covers 11169px — squeezed into 2.2s that
 *    is an average of ~5000px/s, and `power3.inOut` puts its velocity peak in
 *    the exact middle of the trip. Recorded frame by frame, the worst single
 *    frame moved 909px. At that speed the eye doesn't perceive travel, it
 *    perceives a cut — which is precisely the "it teleports me" complaint.
 *
 * 2. GSAP wrote `window.scrollTo` directly while Lenis was simultaneously
 *    driving scroll from its own rAF loop. Two authorities on the same
 *    property; the measured mid-flight velocity came out ~5x higher than the
 *    easing curve alone accounts for, which is the two of them compounding.
 *
 * Now Lenis is the single scroll authority (`lenis.scrollTo`), so ScrollTrigger
 * still receives every update through the existing `lenis.on("scroll")` hook
 * and scroll-linked animations stay in sync for the whole trip. The duration is
 * derived from the distance and clamped, so a short hop finishes quickly and a
 * long one gets the time it actually needs instead of being compressed. The
 * easing is a sine in/out, whose peak velocity is ~1.57x the average rather
 * than the ~2x of a cubic — fewer pixels per frame means less surface to
 * re-rasterise per frame, which the trace showed is the resource in short
 * supply.
 */

// px/second the travel aims for; distance is divided by this to get a duration.
// Retuned slower/more cinematic on request: a short hop (e.g. one section
// down) used to clamp to a snappy 0.7s minimum, which read as "instant" for
// anything closer than ~4200px. Raising the floor and lowering the target
// speed means even adjacent-section clicks get a visible, deliberate glide
// instead of feeling like a cut, while the 2.8s ceiling keeps the longest
// jump (top to Contact) from dragging.
const TARGET_SPEED = 3600;
const MIN_DURATION = 1.1;
const MAX_DURATION = 2.8;

// easeInOutSine — gentlest symmetric curve, lowest velocity peak.
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

let lenis = null;

/** Called once from the root layout so this module can reach the Lenis instance. */
export function registerLenis(instance) {
	lenis = instance;
}

export function scrollToSection(evt, target, offsetY = 40) {
	evt?.preventDefault();

	const el = typeof target === "string" ? document.querySelector(target) : target;
	if (!el) return;

	const destination = el.getBoundingClientRect().top + window.scrollY - offsetY;

	if (prefersReducedMotion()) {
		// Someone who asked for reduced motion does not want a 2-second glide.
		window.scrollTo(0, destination);
		return;
	}

	const distance = Math.abs(destination - window.scrollY);
	const duration = Math.min(MAX_DURATION, Math.max(MIN_DURATION, distance / TARGET_SPEED));

	if (lenis) {
		lenis.scrollTo(el, { offset: -offsetY, duration, easing: easeInOutSine });
		return;
	}

	// Lenis not up yet (or destroyed) — native smooth scroll is a fine fallback.
	window.scrollTo({ top: destination, behavior: "smooth" });
}