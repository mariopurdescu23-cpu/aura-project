import gsap from "gsap";
import { prefersReducedMotion } from "./motion.js";

/**
 * Anchor navigation ("go to that section" from the navbar / buttons).
 *
 * This used to route through Lenis (`lenis.scrollTo`), with Lenis also
 * driving every wheel/touch scroll on the page as a second, permanent
 * scroll authority alongside the browser. That's the architecture behind
 * the teleport bug: on a fast DOWN→UP→DOWN direction reversal, Lenis's own
 * tween/damping state and the browser's native scroll position could
 * disagree about "where we actually are," and reconciling that disagreement
 * is what read as a jump. It got worse on Instagram deep links because
 * Lenis captured its reference scroll position at construction time, before
 * fonts/images had finished settling the layout.
 *
 * Compared against github.com/mariopurdescu23-cpu/rodicachiriches — a site
 * with no scroll-hijacking library at all, just native browser scrolling —
 * confirms the fix: remove the second authority entirely. Day-to-day
 * scrolling (wheel, touch, trackpad, keyboard) is now 100% native; nothing
 * intercepts it, so there is nothing that can fall out of sync with it.
 * GSAP's ScrollTrigger already reads native scroll position by default (no
 * `scroller` override anywhere in the codebase), so every scrub/pin
 * animation keeps working exactly as before.
 *
 * The one place a manufactured, slower motion is still wanted is this
 * "cinematic" navbar jump. It's a single GSAP tween that writes
 * `window.scrollTo` on every frame — not a second persistent scroll engine,
 * just one animation that runs for ~1-3s and is done. It kills itself the
 * instant the user touches wheel/trackpad/touchscreen/keyboard, so at any
 * given moment there is still only ever one thing writing to scroll: either
 * this tween, or the browser.
 */

// px/second the travel aims for; distance is divided by this to get a duration.
// Slower/more cinematic on purpose: a short hop (e.g. one section down) used
// to clamp to a snappy 0.7s minimum, which read as "instant" for anything
// closer than ~4200px. Raising the floor and lowering the target speed means
// even adjacent-section clicks get a visible, deliberate glide instead of
// feeling like a cut, while the 2.8s ceiling keeps the longest jump (top to
// Contact) from dragging.
const TARGET_SPEED = 3600;
const MIN_DURATION = 1.1;
const MAX_DURATION = 2.8;

let activeTween = null;
let listenersAttached = false;

function cancelActiveTween() {
	if (activeTween) {
		activeTween.kill();
		activeTween = null;
	}
}

// The tween is the only thing allowed to move scroll out from under the
// user. The moment they supply their own scroll input, it backs off
// completely and native scrolling takes over — no fighting, no "one more
// frame" of programmatic motion stacked on top of what they just did.
function attachCancelListeners() {
	if (listenersAttached) return;
	listenersAttached = true;

	window.addEventListener("wheel", cancelActiveTween, { passive: true });
	window.addEventListener("touchstart", cancelActiveTween, { passive: true });
	window.addEventListener("keydown", (evt) => {
		if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(evt.key)) {
			cancelActiveTween();
		}
	});
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

	attachCancelListeners();
	cancelActiveTween();

	const startY = window.scrollY;
	const distance = Math.abs(destination - startY);
	const duration = Math.min(MAX_DURATION, Math.max(MIN_DURATION, distance / TARGET_SPEED));

	const proxy = { y: startY };
	activeTween = gsap.to(proxy, {
		y: destination,
		duration,
		ease: "sine.inOut",
		onUpdate: () => window.scrollTo(0, proxy.y),
		onComplete: () => {
			activeTween = null;
		},
	});
}
