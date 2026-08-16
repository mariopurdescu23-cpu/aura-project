<script>
    import { onMount } from "svelte";
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import "./layout.css";
    import favicon from "$lib/assets/favicon-weberescu.png";
    import appleTouchIcon from "$lib/assets/favicon-apple-touch.png";
    import Navbar from "$lib/components/Navbar.svelte";
    import Cursor from "$lib/components/Cursor.svelte";
    import ScrollDebug from "$lib/components/ScrollDebug.svelte";
    import { dev } from "$app/environment";
    import { injectAnalytics } from "@vercel/analytics/sveltekit";
    import { initLang, lang } from "$lib/i18n/index.js";
    import { prefersReducedMotion } from "$lib/motion.js";

    injectAnalytics({ mode: dev ? "development" : "production" });

    let { children } = $props();

    // Keeps <html lang> truthful once the client picks a language (manual
    // choice, timezone heuristic, or the IP lookup in initLang) — the
    // prerendered markup already ships lang="ro" for crawlers, this just
    // keeps it in sync for real visitors after hydration.
    $effect(() => {
        document.documentElement.lang = $lang;
    });

    onMount(() => {
        initLang();

        gsap.registerPlugin(ScrollTrigger);

        // `ignoreMobileResize: true` sounds like "never refresh from the
        // mobile toolbar showing/hiding," but reading GSAP's own source
        // (node_modules/gsap/ScrollTrigger.js) shows it's actually a
        // threshold: on touch devices it only skips the refresh if the
        // window height changed by LESS than 25% of the viewport. Depending
        // on the phone, the combined address bar + bottom toolbar can eat
        // more of the screen than that — so the built-in guard alone still
        // let a toolbar show/hide trigger a full `ScrollTrigger.refresh()`
        // on some devices. A refresh mid-gesture recomputes every trigger's
        // start/end pixel positions; if any shifted, every scrub'd tween's
        // progress gets recalculated against the new positions at the
        // *same* scrollY — which snaps the scrubbed value (Process's line,
        // Services' card scale, Manifesto's word colour) to wherever that
        // new math says it should be. The document didn't jump; the
        // scroll-linked animation did, which reads the same to the eye.
        //
        // `autoRefreshEvents` here removes "resize" from the list of
        // events that trigger ScrollTrigger's own automatic refresh
        // entirely — no threshold, no guessing, it simply never fires from
        // a window resize. We still need the real, non-toolbar-driven case
        // (rotating the phone, resizing a desktop window) to refresh — that
        // is handled explicitly below by comparing widths, since a toolbar
        // showing/hiding only ever changes `innerHeight`, never
        // `innerWidth`.
        ScrollTrigger.config({
            ignoreMobileResize: true,
            autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
        });

        // ---- FROZEN VIEWPORT HEIGHT UNIT (--app-vh) ----
        //
        // Measured on the actual reporting device (iPhone, Chrome iOS,
        // innerW 430) via the ?debug=1 overlay, across a real toolbar
        // transition:
        //
        //   toolbar shown:  innerH 739  100svh=739  100lvh=739  100dvh=739
        //   toolbar hidden: innerH 839  100svh=839  100lvh=839  100dvh=839
        //   docHeight 13891 -> 14091 (+200)   scrollY 9384 -> 9619 (+235)
        //
        // That kills the assumption every previous fix rested on. On this
        // browser `svh`, `lvh` and `dvh` all resolve to the SAME number and
        // all three track the CURRENT viewport. The spec says `svh` is the
        // small viewport height and must stay put when browser chrome
        // shows/hides — this engine does not implement that distinction, so
        // the earlier `dvh` -> `svh` change was a no-op here. Any
        // viewport-height unit is unusable for stable layout on this
        // device, and no other unit-level choice fixes it.
        //
        // So the height gets frozen in JS instead: `--app-vh` is 1% of the
        // viewport height, measured once, and deliberately NOT updated when
        // the toolbar moves. It is only re-measured when `innerWidth`
        // changes — a mobile toolbar overlays the viewport vertically and
        // never changes its width, while a real resize (rotation, desktop
        // window resize) always does. Sections that need to be viewport-tall
        // use `calc(var(--app-vh, 1svh) * N)`, so the document's height
        // becomes independent of the toolbar entirely: the remaining +200px
        // of docHeight growth above is exactly Hero + Cta at 100svh each,
        // and freezing the unit removes it at the source.
        //
        // The `1svh` fallback keeps server-rendered HTML and the first paint
        // (before this runs) sized exactly as before, so nothing shifts on
        // load. Desktop renders identically: with a stable viewport, the
        // frozen value equals what the unit resolved to anyway.
        const setViewportUnit = () => {
            document.documentElement.style.setProperty("--app-vh", window.innerHeight / 100 + "px");
        };
        setViewportUnit();

        let lastWidth = window.innerWidth;
        const onResize = () => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            setViewportUnit();
            ScrollTrigger.refresh();
        };
        window.addEventListener("resize", onResize, { passive: true });

        // Scroll architecture, compared directly against
        // github.com/mariopurdescu23-cpu/rodicachiriches (a site with no
        // scroll-hijacking library at all — just native browser scrolling,
        // `scroll-behavior: smooth` for its anchor links, and
        // IntersectionObserver reveals). That site never teleports on a
        // fast DOWN→UP→DOWN reversal or on an Instagram deep link, for the
        // simplest possible reason: there's only ever one thing writing to
        // scroll — the browser.
        //
        // This page used to run Lenis permanently underneath every wheel
        // and touch event, as a second scroll authority alongside the
        // browser. Lenis keeps its own internal target/velocity state; on a
        // fast direction reversal, or right after a deep-link load where
        // fonts/images were still settling the layout, that internal state
        // could disagree with where the browser's native scroll position
        // actually was — reconciling that disagreement is what read as a
        // jump/teleport. No amount of tuning Lenis's own options changes
        // that shape of bug, because the bug is having two authorities in
        // the first place, not which numbers either one uses.
        //
        // Fix: remove Lenis. Day-to-day scrolling (wheel, touch, trackpad,
        // keyboard) is now 100% native — nothing intercepts it, so nothing
        // can fall out of sync with it. GSAP's ScrollTrigger already reads
        // native scroll position by default (nothing in this codebase ever
        // set a `scroller` override), so every scroll-linked animation
        // (Process's progress line, Services' sticky stack, Manifesto's
        // word colour scrub, Hero's parallax) keeps tracking scroll exactly
        // as before — the only thing that changed is what drives scroll.
        // The one manufactured motion left is the "cinematic" navbar jump,
        // now a single GSAP tween in scrollTo.js that writes
        // `window.scrollTo` and cancels itself the instant the user
        // supplies their own scroll input — so even there, only one thing
        // is ever driving scroll at a time.
        if (prefersReducedMotion()) {
            // The frozen viewport unit above applies to everyone, so its
            // listener still needs tearing down on this path too.
            return () => window.removeEventListener("resize", onResize);
        }

        // Layout stabilization after load: every section component creates
        // its own ScrollTrigger instances in its own onMount, computing
        // start/end pixel positions from the layout AT THAT MOMENT. Two of
        // the page's webfonts (Space Grotesk, Instrument Serif) load with
        // `font-display: swap`, so headings reflow once they arrive — after
        // every trigger's boundaries were already computed against the
        // fallback font's metrics. Refreshing once fonts are ready, and
        // again once everything (including images) has loaded, keeps
        // ScrollTrigger's cached positions in sync with the real layout.
        // `ScrollTrigger.refresh()` is cheap and safe to call any time — it
        // only recomputes existing triggers, it doesn't create or destroy
        // anything.
        const refreshTriggers = () => ScrollTrigger.refresh();
        document.fonts?.ready?.then(refreshTriggers);
        window.addEventListener("load", refreshTriggers, { once: true });

        // Deep-link entry (Instagram bio link, a shared "#services" URL,
        // etc.): the browser already jumps to the target element natively
        // before hydration — that part is free and correct, same as
        // rodicachiriches. The only failure mode left is layout settling
        // *after* that native jump (the font-swap reflow above, images
        // loading in below the fold), which can leave the viewport sitting
        // slightly off from the section by the time everything is in.
        //
        // Fix: re-run the same native jump once fonts/images have actually
        // settled, but only while the user hasn't scrolled yet themselves —
        // the instant they have, their input drives scroll, not us.
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
                const y = el.getBoundingClientRect().top + window.scrollY - 40;
                window.scrollTo(0, y);
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
            window.removeEventListener("resize", onResize);
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

<ScrollDebug />
<Cursor />
<Navbar />

<main class="app-wrapper bg-white">
    {@render children()}
</main>
