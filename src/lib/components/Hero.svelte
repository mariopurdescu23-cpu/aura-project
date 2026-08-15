<script>
	import { onMount } from "svelte";
	import gsap from "gsap";
	import { scrollToSection } from "$lib/scrollTo.js";
	import { fillPress } from "$lib/actions/fillPress.js";
	import { t } from "$lib/i18n/index.js";
	import { pauseWhenHidden, prefersReducedMotion } from "$lib/motion.js";

	let lines = $state([]);
	let metaTop = $state();
	let descRef = $state();
	let ctaContainer = $state();
	let scrollCue = $state();
	let orbRef = $state();
	let heroRef = $state();

	onMount(() => {
		// Reduced motion: the elements below are hidden by the tween's own
		// `gsap.set` calls, not by markup, so bailing out early leaves them in
		// their natural, visible state — nothing else to undo.
		if (prefersReducedMotion()) return;

		const tl = gsap.timeline({ delay: 0.15 });

		gsap.set(orbRef, { autoAlpha: 0, scale: 0.7 });
		gsap.set(lines, { yPercent: 120, rotateZ: 1.5 });
		gsap.set([metaTop, descRef, ctaContainer, scrollCue], { y: 16, autoAlpha: 0 });

		tl.to(orbRef, { autoAlpha: 1, scale: 1, duration: 1.8, ease: "power3.out" })
			.to(metaTop, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out" }, "-=1.4")
			.to(
				lines,
				{ yPercent: 0, rotateZ: 0, duration: 1.3, stagger: 0.1, ease: "expo.out" },
				"-=1.2",
			)
			.to(descRef, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, "-=0.7")
			.to(ctaContainer, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, "-=0.7")
			.to(scrollCue, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, "-=0.6");

		// Slow autonomous drift so the orb feels alive even without the mouse.
		// Paused once the hero scrolls away: it is a blurred gradient circle, so
		// every frame of it is a real rasterisation cost, and there is no reason
		// to pay it for the other ~15000px of the page.
		const drift = gsap.to(orbRef, {
			x: "+=40",
			y: "-=30",
			rotate: 8,
			duration: 9,
			ease: "sine.inOut",
			yoyo: true,
			repeat: -1,
		});
		const stopDrift = pauseWhenHidden(drift, heroRef, "0px");

		const quickX = gsap.quickTo(orbRef, "x", { duration: 1.1, ease: "power3.out" });
		const quickY = gsap.quickTo(orbRef, "y", { duration: 1.1, ease: "power3.out" });
		const quickScale = gsap.quickTo(orbRef, "scale", { duration: 0.8, ease: "power2.out" });

		// The headline parallax used to call `gsap.to(lines, ...)` inside the
		// mousemove handler: that allocates a fresh tween (plus its config
		// object) per element per event, so a 1000Hz mouse produced ~3000
		// short-lived tween objects a second purely as garbage. `quickTo`
		// reuses one tween per property and just retargets it.
		const lineQuick = lines.map((el) => ({
			x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power2.out" }),
			y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power2.out" }),
		}));

		// `getBoundingClientRect()` used to run on every mousemove event — a
		// forced style/layout read at up to 1000Hz on a high-polling-rate mouse.
		// The hero's box only changes on resize, so it is read once and cached.
		let heroRect = heroRef.getBoundingClientRect();
		const refreshRect = () => {
			heroRect = heroRef.getBoundingClientRect();
		};
		window.addEventListener("resize", refreshRect, { passive: true });

		const handleMouseMove = (e) => {
			if (!heroRef) return;
			const rect = heroRect;
			const relX = (e.clientX - rect.left) / rect.width - 0.5;
			const relY = (e.clientY - rect.top) / rect.height - 0.5;
			quickX(relX * 120);
			quickY(relY * 100);
			quickScale(1 + Math.abs(relX) * 0.08);

			for (let i = 0; i < lineQuick.length; i++) {
				lineQuick[i].x(relX * 14);
				lineQuick[i].y(relY * 10);
			}
		};

		if (window.innerWidth > 768) {
			window.addEventListener("mousemove", handleMouseMove, { passive: true });
		}

		return () => {
			stopDrift();
			window.removeEventListener("resize", refreshRect);
			window.removeEventListener("mousemove", handleMouseMove);
		};
	});
</script>

<!--
	`min-h-[100svh]` here (and the `svh` used the same way in Cta, Services'
	cards, and WorkShowcase's grid heights) used to be `dvh`. `dvh` tracks
	the browser's *current* UI chrome state — on mobile, scrolling down
	hides the address bar/bottom toolbar and the viewport (and every
	`dvh`-sized box) grows; scrolling back up shows the chrome again and
	everything shrinks back. That resize happens mid-scroll, on real
	devices, on every up/down direction change — not from any bug in this
	page's own JS. Every box sized with `dvh` was physically changing
	height as a side effect of scroll direction, which shifted the whole
	document's layout and every ScrollTrigger position computed against
	it, at the exact moments (chrome showing/hiding on a direction change)
	this was reported worst — the "teleport near the browser's bottom bar"
	on real phones. `svh` ("small viewport height") is fixed to the
	viewport's smallest possible size, as if the chrome were always shown,
	so these boxes no longer resize while scrolling at all. Trade-off: a
	sliver of extra space can appear below a full-height section once the
	chrome is actually hidden — far cheaper than the page's layout moving
	under the user's finger.
-->
<section
	bind:this={heroRef}
	id="hero"
	class="w-full min-h-[100svh] flex flex-col justify-between relative overflow-hidden bg-white pt-32 md:pt-36 pb-10 px-6 md:px-12"
>
	<!-- Signature purple visual element -->
	<div
		bind:this={orbRef}
		class="pointer-events-none absolute top-[8%] right-[2%] md:right-[10%] w-[280px] h-[280px] md:w-[480px] md:h-[480px] rounded-full will-change-transform z-0"
		style="background: radial-gradient(circle at 35% 30%, #b39ffb 0%, #7C3AED 35%, #5B21F5 62%, rgba(91,33,245,0) 78%); filter: blur(6px);"
	></div>
	<div
		class="pointer-events-none absolute top-[8%] right-[2%] md:right-[10%] w-[280px] h-[280px] md:w-[480px] md:h-[480px] rounded-full opacity-40 blur-[90px] z-0"
		style="background: #5B21F5;"
	></div>

	<!-- Top meta row -->
	<div
		bind:this={metaTop}
		class="relative z-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-mono text-[11px] md:text-xs uppercase tracking-widest text-black/40"
	>
		<span>{$t.hero.metaLeft}</span>
		<span>{$t.hero.metaRight}</span>
	</div>

	<!-- Headline -->
	<div class="relative z-10 w-full flex-1 flex flex-col justify-center py-10 md:py-6">
		<h1
			class="font-display font-medium leading-[0.86] tracking-tight text-black text-[16vw] md:text-[8.4vw] max-w-[95vw]"
		>
			<div class="overflow-hidden pb-2">
				<div bind:this={lines[0]} class="md:will-change-transform">{$t.hero.line1}</div>
			</div>
			<div class="overflow-hidden pb-2">
				<div bind:this={lines[1]} class="md:will-change-transform">{$t.hero.line2}</div>
			</div>
			<div class="overflow-hidden pb-2">
				<div bind:this={lines[2]} class="md:will-change-transform font-serif-italic text-[#5B21F5]">
					{$t.hero.line3}
				</div>
			</div>
		</h1>
	</div>

	<!-- Bottom row: description + CTAs + scroll cue -->
	<div class="relative z-10 w-full flex flex-col md:flex-row justify-between items-end gap-10">
		<div class="max-w-md">
			<p
				bind:this={descRef}
				class="text-base md:text-lg text-black/55 font-sans font-light leading-relaxed"
			>
				{$t.hero.desc}
			</p>

			<div bind:this={ctaContainer} class="mt-8 flex flex-wrap gap-4">
				<a
					href="#contact"
					onclick={(e) => scrollToSection(e, "#contact")}
					use:fillPress
					data-cursor-label={$t.cta.label}
					class="magnetic-btn px-8 py-4 bg-[#0A0A0A] text-white rounded-full font-sans font-medium hover:bg-[#5B21F5] transition-colors duration-500 cursor-pointer text-center text-sm"
				>
					{$t.hero.ctaPrimary}
				</a>
				<a
					href="#work"
					onclick={(e) => scrollToSection(e, "#work")}
					use:fillPress
					data-cursor-label={$t.hero.ctaSecondary}
					class="px-8 py-4 bg-transparent text-black border border-black/15 rounded-full font-sans font-medium hover:border-black/40 transition-all duration-500 cursor-pointer text-center text-sm"
				>
					{$t.hero.ctaSecondary}
				</a>
			</div>
		</div>

		<div bind:this={scrollCue} class="hidden sm:flex flex-col items-center gap-3 text-black/30">
			<span class="text-[10px] font-mono uppercase tracking-widest [writing-mode:vertical-lr]">{$t.hero.scroll}</span>
			<span class="w-px h-16 bg-black/15 relative overflow-hidden">
				<span class="absolute top-0 left-0 w-full h-4 bg-[#5B21F5] scroll-line"></span>
			</span>
		</div>
	</div>
</section>

<style>
	.scroll-line {
		animation: scrollLine 2s ease-in-out infinite;
	}
	@keyframes scrollLine {
		0% {
			transform: translateY(-100%);
		}
		100% {
			transform: translateY(400%);
		}
	}
</style>
