<script>
    import { onMount } from "svelte";
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import "./layout.css";
    import favicon from "$lib/assets/favicon-weberescu.png";
    import appleTouchIcon from "$lib/assets/favicon-apple-touch.png";
    import Navbar from "$lib/components/Navbar.svelte";
    import Cursor from "$lib/components/Cursor.svelte";
    import { dev } from "$app/environment";
    import { injectAnalytics } from "@vercel/analytics/sveltekit";
    import { initLang } from "$lib/i18n/index.js";
    import { prefersReducedMotion } from "$lib/motion.js";

    injectAnalytics({ mode: dev ? "development" : "production" });

    let { children } = $props();

    onMount(() => {
        initLang();

        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ ignoreMobileResize: true });

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
            return;
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
