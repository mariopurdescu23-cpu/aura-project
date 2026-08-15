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

    injectAnalytics({ mode: dev ? "development" : "production" });

    let { children } = $props();

    onMount(() => {
        initLang();

        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ ignoreMobileResize: true });

        // Inițializăm Lenis (Smooth Scrolling) — autoRaf DEZACTIVAT
        // intenționat: îl conducem manual prin gsap.ticker mai jos,
        // ca să existe un singur loop de animație, nu două rulând
        // simultan (bug care dubla constant costul de CPU la scroll).
        const lenis = new Lenis({
            autoRaf: false,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: "vertical",
            gestureDirection: "vertical",
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        // Legăm update-urile de scroll ale Lenis la GSAP ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        const update = (time) => {
            lenis.raf(time * 1000);
        };
        gsap.ticker.add(update);

        gsap.ticker.lagSmoothing(0);

        return () => {
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
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<Cursor />
<Navbar />

<main class="app-wrapper bg-white">
    {@render children()}
</main>