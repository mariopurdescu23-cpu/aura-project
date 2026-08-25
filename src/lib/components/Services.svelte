<script>
	import { onMount } from "svelte";
	import gsap from "gsap";
	import ScrollTrigger from "gsap/ScrollTrigger";
	import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";
	import { t } from "$lib/i18n/index.js";
	import { prefersReducedMotion } from "$lib/motion.js";
	import { serviceSlugs, getServiceImage } from "$lib/serviceImages.js";

	// The panel is at most 460px wide on desktop and ~full width on mobile.
	const SIZES = "(min-width: 768px) 460px, 90vw";

	let services = $derived(
		$t.services.items.map((s, i) => ({ ...s, slug: serviceSlugs[i], ...getServiceImage(serviceSlugs[i]) })),
	);
	let cardsRef = $state([]);
	let innerRef = $state([]);
	let dimRef = $state([]);
	let sectionRef = $state();

	onMount(() => {
		// The stacking scale/dim is decorative; sticky positioning alone still
		// gives the cards their layered behaviour without any motion.
		if (prefersReducedMotion()) return;

		gsap.registerPlugin(ScrollTrigger);

		// The "previous card recedes as the next one covers it" effect used to
		// be done with a CSS `filter: brightness()` tween on the whole card.
		// `filter` on an element that also has `overflow: hidden` + rounded
		// corners + its own transformed/hover-animated children (the photo)
		// is a known trigger for compositing glitches in some browsers — the
		// layer can flash solid black while repainting, especially on hover.
		// A plain opacity-based dark scrim avoids `filter` entirely and gives
		// the same visual result safely.
		// `scrub: true` (no number) ties the tween 1:1 to the raw scroll
		// event stream — every single scroll event forces GSAP to recompute
		// and write style/transform synchronously, no matter how often they
		// fire. Native scrolling can dispatch far more of those events per
		// visual frame than the page's old Lenis-driven scroll ever did
		// (Lenis's lerp damping incidentally rate-limited how fast the
		// "current" scroll value could change, which also rate-limited how
		// often this fired). With native scroll now the only driver, that
		// unsmoothed scrub is what showed up as card animation lag/jank on
		// real devices, worse the longer a scroll gesture ran.
		//
		// `scrub: 0.3` is the fix already used elsewhere in this codebase
		// (Process's line: 0.6, Manifesto's word colour: 1) — GSAP
		// interpolates the tween's value toward the scroll-driven target
		// over that many seconds using its own ticker, instead of writing
		// synchronously on every raw scroll event. Still reads as
		// immediate/tight at 0.3s, but decouples the animation's update
		// rate from the raw input event rate.
		//
		// The scale tween targets `innerRef[i]` (the card's inner rounded
		// box), not `cardsRef[i]` (the `position: sticky` wrapper itself).
		// Writing a `transform` directly onto a sticky element is a known
		// WebKit/Safari fault line: the browser has to keep recomputing
		// that element's stuck offset against its containing block on
		// every scroll tick, and doing that to an element whose transform
		// is *also* changing every tick makes Safari's sticky/compositor
		// bookkeeping visibly disagree with itself mid-scroll — the
		// element's position briefly snaps to an earlier or later state
		// before correcting, which reads as exactly the double-take/bounce
		// reported on a real iPhone right at the Services→Work handoff (the
		// last sticky card unsticking while its scale tween is still live).
		// Confirmed frame-by-frame in the screen recording sent over: the
		// page's visible content flips back to an earlier scroll position
		// and forward again twice in under a second, right as that card
		// leaves. Keeping `position: sticky` on a plain, untransformed
		// wrapper and animating a transform-only child instead removes the
		// conflict entirely — sticky positioning is computed from a stable
		// element, and GSAP is free to scale the child however it wants.
		//
		// This section unmounts on navigation away from `/` (a `/servicii/[slug]`
		// visit), so every ScrollTrigger created below has to be torn down or
		// it keeps listening on scroll forever against detached DOM — up to
		// two per card. `gsap.context` tracks everything created inside it and
		// `.revert()` kills all of it in one call.
		// A real scroll trace (requestAnimationFrame deltas sampled through an
		// actual wheel-driven scroll, not a synthetic jump) measured this
		// section at ~60% of frames missing the 60fps budget, worst offender
		// on the page after the Cta glow. Part of that cost was two separate
		// ScrollTrigger instances per card (identical trigger/start/end,
		// scrubbing two different targets) each independently recomputing its
		// own scroll progress every frame. Folding both into one timeline —
		// one ScrollTrigger driving two tweens started at the same position —
		// halves that per-frame bookkeeping while producing the exact same
		// scale+dim motion.
		const ctx = gsap.context(() => {
			cardsRef.forEach((card, i) => {
				if (i === cardsRef.length - 1) return;
				const target = innerRef[i] || card;
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: card,
						start: "top 88px",
						end: "bottom top",
						scrub: 0.3,
						onToggle: (self) => {
							gsap.set(target, { willChange: self.isActive ? "transform" : "auto" });
							if (dimRef[i]) gsap.set(dimRef[i], { willChange: self.isActive ? "opacity" : "auto" });
						},
					},
				});
				tl.to(target, { scale: 0.94, ease: "none" }, 0);
				if (dimRef[i]) {
					tl.to(dimRef[i], { opacity: 0.18, ease: "none" }, 0);
				}
			});
		}, sectionRef);

		return () => ctx.revert();
	});
</script>

<section
	bind:this={sectionRef}
	id="services"
	class="w-full bg-[#F7F7F8] text-black py-24 md:py-32 relative"
>
	<div class="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24">
		<span class="text-xs font-mono text-black/40 uppercase tracking-widest mb-6 block">{$t.services.label}</span>
		<h2 class="font-display text-4xl md:text-6xl leading-[1.05] max-w-2xl">
			{$t.services.title1}<br /><span class="font-serif-italic text-black/40">{$t.services.title2}</span>
		</h2>
	</div>

	<div class="max-w-7xl mx-auto px-4 md:px-6">
		{#each services as service, i}
			<div
				bind:this={cardsRef[i]}
				class="sticky top-[72px] md:top-[88px] mb-5 md:mb-6"
				style="z-index: {i + 1};"
			>
				<div
					bind:this={innerRef[i]}
					class="group rounded-[24px] md:rounded-[36px] bg-white border border-black/8 shadow-[0_30px_80px_rgba(10,10,10,0.08)] px-6 md:px-16 py-10 md:py-16 min-h-[calc(var(--app-vh,1svh)*58)] md:min-h-[calc(var(--app-vh,1svh)*64)] flex flex-col justify-between overflow-hidden relative isolate origin-top"
				>
					<!-- Hover-only glow, so it is desktop-only: on touch it can never be
					     shown, but a 340px box with an 80px blur still sat in every
					     card's stacking context on phones. -->
					<div
						class="hidden md:block absolute -top-24 -right-24 w-[340px] h-[340px] rounded-full bg-[#5B21F5] opacity-0 group-hover:opacity-[0.06] blur-[80px] transition-opacity duration-700 pointer-events-none"
					></div>
					<!-- `will-change: opacity` is earned here, not sprinkled: this scrim is
					     the one element whose opacity is scrubbed continuously while the
					     card is in range. Promoting it lets the compositor fade it
					     without re-rasterising the card underneath. Measured over 3 runs:
					     46.4 -> 49.3 fps through this section, jank frames 28% -> 20%.
					     Toggled on/off via the ScrollTrigger's onToggle below (same for
					     the card's own scale tween) rather than left on permanently —
					     with up to 6 cards that's up to 12 always-on compositor layers
					     for the section's entire lifetime otherwise, most of them for a
					     card nowhere near the active scroll range. -->
					<div
						bind:this={dimRef[i]}
						class="absolute inset-0 bg-[#0A0A0A] opacity-0 pointer-events-none z-30"
					></div>

					<div class="flex justify-between items-start relative z-10">
						<span class="font-display text-2xl md:text-4xl text-black/25">{service.num}</span>
						<a
							href="/servicii/{service.slug}"
							data-cursor-label={$t.services.viewMore}
							aria-label="{$t.services.viewMore} — {service.title}"
							class="flex items-center gap-1.5 rounded-full bg-[#5B21F5] text-white text-xs font-mono uppercase tracking-widest px-3.5 py-2 md:bg-transparent md:text-black/20 md:hover:text-[#5B21F5] md:hover:bg-black/5 md:p-1 md:-m-1 md:normal-case md:tracking-normal md:font-sans transition-colors duration-300"
						>
							<span class="md:hidden">{$t.services.viewMore}</span>
							<ArrowUpRight class="w-3.5 h-3.5 md:w-10 md:h-10 md:hover:rotate-45 transition-transform duration-500" />
						</a>
					</div>

					<!-- Visual panel — sized to actually fill the card's height on desktop
					     (justify-between otherwise leaves a lot of dead white space between
					     the number/arrow row and the title row, since 16:9 at a modest width
					     is short). Mobile keeps its own 16:9/full-width treatment untouched. -->
					<div class="relative z-10 flex justify-center md:justify-end my-6 md:my-4 md:flex-1 md:min-h-0">
						<div
							class="w-full md:w-[70%] md:max-w-[620px] aspect-[16/9] md:aspect-auto md:h-full rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(10,10,10,0.12)] isolate"
							style="transform: translateZ(0);"
						>
							<picture class="contents">
								<source type="image/avif" srcset={service.sources.avif} sizes={SIZES} />
								<source type="image/webp" srcset={service.sources.webp} sizes={SIZES} />
								<img
									src={service.image}
									alt={service.title}
									width="800"
									height="450"
									loading="lazy"
									decoding="async"
									class="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 group-hover:will-change-transform"
								/>
							</picture>
						</div>
					</div>

					<div class="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
						<h3 class="font-display text-4xl md:text-7xl leading-[0.95] max-w-xl">
							{service.title}
						</h3>
						<div class="max-w-sm">
							<p class="text-base md:text-lg text-black/55 font-sans font-light leading-relaxed mb-6">
								{service.desc}
							</p>
							<div class="flex flex-wrap gap-2">
								{#each service.tags as tag}
									<span
										class="text-xs font-mono uppercase tracking-widest text-[#5B21F5] border border-[#5B21F5]/25 bg-[#5B21F5]/[0.05] rounded-full px-3 py-1.5"
										>{tag}</span
									>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>
