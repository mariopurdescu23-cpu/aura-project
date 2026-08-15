<script>
    import { onMount } from "svelte";
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import Lenis from "lenis";
    import "lenis/dist/lenis.css";
    import "./layout.css";
    import favicon from "$lib/assets/favicon-weberescu.png";
    import appleTouchIcon from "$lib/assets/favicon-apple-touch.png";
    import Navbar from "$lib/components/Navbar.svelte";
    import Cursor from "$lib/components/Cursor.svelte";
    import { dev } from "$app/environment";
    import { injectAnalytics } from "@vercel/analytics/sveltekit";
    import { initLang } from "$lib/i18n/index.js";
    import { registerLenis } from "$lib/scrollTo.js";
    import { prefersReducedMotion } from "$lib/motion.js";

    injectAnalytics({ mode: dev ? "development" : "production" });

    let { children } = $props();

    onMount(() => {
        initLang();

        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ ignoreMobileResize: true });

        // Someone who has asked their OS for reduced motion should not get an
        // inertial scroll hijack at all — native scrolling is the correct
        // experience, and skipping Lenis also removes its rAF loop entirely.
        if (prefersReducedMotion()) {
            return;
        }

        // Inițializăm Lenis (Smooth Scrolling) — autoRaf DEZACTIVAT
        // intenționat: îl conducem manual prin gsap.ticker mai jos,
        // ca să existe un singur loop de animație, nu două rulând
        // simultan (bug care dubla constant costul de CPU la scroll).
        //
        // `duration`/`easing` were previously set here as top-level options.
        // Those aren't just defaults for `lenis.scrollTo()` — Lenis's own
        // wheel handler (`onVirtualScroll`) forwards them on *every single
        // wheel tick*: `this.scrollTo(this.targetScroll + delta, { duration:
        // this.options.duration, easing: this.options.easing, ... })`. And
        // inside GSAP/Lenis's `Animate.advance()`, having both `duration` and
        // `easing` set takes priority over `lerp` entirely (see
        // node_modules/lenis/dist/lenis.mjs). So continuous wheel scrolling
        // was never using simple lerp damping — every wheel event restarted a
        // fresh 1.2s eased tween from the current (already-moving) position to
        // a new target. The configured easing was an expo-out curve, which has
        // a very steep initial velocity; retargeting it mid-flight is fine
        // while scrolling continues in the same direction, but the instant a
        // user reverses direction (down→up→down), the tween is thrown away and
        // restarted with that same steep initial velocity in the *opposite*
        // direction — a velocity discontinuity, which reads as a jump/glitch.
        // This is the actual mechanism behind "teleport on scroll" during fast
        // direction changes.
        //
        // Removing `duration`/`easing` here lets `Animate.advance()` fall back
        // to lerp/damping (`lerp: 0.1`, Lenis's own default), which is
        // continuous-velocity by construction (frame-rate-independent
        // exponential damping toward whatever the current target is) — so
        // retargeting on a fast reversal is smooth by design, not a special
        // case. `lenis.scrollTo()` calls (anchor nav, see scrollTo.js) still
        // pass their own explicit `duration`/`easing` per call and are
        // unaffected — this only changes wheel/touch-driven scrolling.
        //
        // (`direction`/`gestureDirection`/`smooth`/`smoothTouch` below were
        // also removed: they're Lenis 0.x option names that don't exist in
        // this Lenis 1.x — silently ignored, not doing anything. The 1.x
        // equivalents already default to the same behaviour these were
        // trying to set.)
        const lenis = new Lenis({
            autoRaf: false,
            lerp: 0.1,
            touchMultiplier: 2,
        });

        // Legăm update-urile de scroll ale Lenis la GSAP ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        const update = (time) => {
            lenis.raf(time * 1000);
        };
        gsap.ticker.add(update);

        // `gsap.ticker.lagSmoothing(0)` was here before, disabling GSAP's
        // built-in protection against long stalls — NOT just for Lenis, for
        // every GSAP-ticker-driven thing on the page. Without it, if the main
        // thread stalls for any reason (heavy raster/paint work, a GC pause,
        // the tab losing focus, or just a slower CPU — an iPhone under load
        // stalls far more often than a desktop), the ticker hands the *next*
        // tick a raw, uncapped elapsed time. That flows straight into
        // `lenis.raf(time * 1000)`, and Lenis's damping (`damp()`) is
        // mathematically stable for any deltaTime — it always converges — but
        // a large-enough deltaTime converges almost entirely *in one step*.
        // The physics is "correct" (it's heading to the right place) but the
        // eye sees a bunch of frames get silently skipped and the page
        // arrive somewhere new in a single jump: a teleport, generated from
        // a stale/oversized deltaTime rather than a smooth run of frames.
        // This is a real, structural cause — and it explains why it's worse
        // on iPhone specifically (weaker CPU, more/longer stalls) while
        // still reproducible on desktop (any stall triggers it, just less
        // often). Leaving lag smoothing at GSAP's own default restores its
        // built-in, purpose-made handling for exactly this failure mode —
        // this is not a homemade timeout, it's un-disabling the library's
        // own safeguard.

        // Anchor navigation goes through this same instance, so scrolling has
        // exactly one authority instead of GSAP and Lenis both writing scroll.
        registerLenis(lenis);

        // Layout stabilization after load: every section component creates
        // its own ScrollTrigger instances in its own onMount, and each one
        // computes its start/end pixel positions from the layout AT THAT
        // MOMENT. Two of the page's webfonts (Space Grotesk, Instrument
        // Serif) load with `font-display: swap`, so headings reflow once
        // they arrive — after every trigger's boundaries were already
        // computed against the fallback font's metrics. Nothing tells
        // ScrollTrigger to recompute after that reflow, so its cached
        // trigger positions silently drift out of sync with the actual
        // layout — which shows up as scroll-linked animations (the Services
        // stack, the Process timeline, Manifesto's word colour) snapping or
        // jumping out of step with where the user has actually scrolled to.
        // This reproduces on *any* fresh load, hash or not — including a
        // bare "weberescu.ro" open from Instagram — which is why the
        // previous fix (scoped to `location.hash`) didn't cover it.
        //
        // Fix: refresh once fonts are ready, and again once everything
        // (including images) has loaded. `ScrollTrigger.refresh()` is cheap
        // and safe to call any time — it just recomputes existing triggers,
        // it doesn't create or destroy anything.
        const refreshTriggers = () => ScrollTrigger.refresh();
        document.fonts?.ready?.then(refreshTriggers);
        window.addEventListener("load", refreshTriggers, { once: true });

        // Deep-link entry (Instagram bio link, a shared "#services" URL, etc.):
        // the browser jumps to the target element natively, before hydration
        // and before images/fonts have finished loading — against a layout
        // that's still settling. Lenis's constructor reads whatever `scrollY`
        // the browser landed on as its own reference point, so if the page
        // reflows afterward, Lenis's internal target silently drifts out of
        // sync with where the section actually ended up — and the first
        // scroll input "jumps" while the two reconcile.
        //
        // Fix: re-run the same jump once layout has actually settled (fonts
        // ready, then again on window `load` once images are in), so Lenis's
        // target is recomputed against final geometry. Only while the user
        // hasn't touched the wheel/trackpad/screen yet — once they have,
        // their input is what should drive scroll, not us silently
        // overriding it under them.
        let removeHashSync;
        if (location.hash) {
            history.scrollRestoration = "manual";

            let userInteracted = false;
            const markInteracted = () => {
                userInteracted = true;
            };
            window.addEventListener("wheel", markInteracted, { once: true, passive: true });
            window.addEventListener("touchstart", markInteracted, { once: true, passive: true });

            const resyncToHash = () => {
                if (userInteracted) return;
                const el = document.querySelector(location.hash);
                if (!el) return;
                lenis.resize();
                lenis.scrollTo(el, { offset: -40, immediate: true });
                ScrollTrigger.refresh();
            };

            document.fonts?.ready?.then(resyncToHash);
            window.addEventListener("load", resyncToHash, { once: true });

            removeHashSync = () => {
                window.removeEventListener("wheel", markInteracted);
                window.removeEventListener("touchstart", markInteracted);
                window.removeEventListener("load", resyncToHash);
            };
        }

        return () => {
            removeHashSync?.();
            window.removeEventListener("load", refreshTriggers);
            registerLenis(null);
            gsap.ticker.remove(update);
            lenis.destroy();
        };
    });
</script>

<svelte:head>
    <link rel="icon" type="image/png" href={favicon} />
    <link rel="apple-touch-icon" href={appleTouchIcon} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Inter:wght@300;400;500&family=Space+Grotesk:wght@400;500;700&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<Cursor />
<Navbar />

<main class="app-wrapper bg-white">
    {@render children()}
</main>