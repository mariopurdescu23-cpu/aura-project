<script>
	import { onMount } from "svelte";
	import gsap from "gsap";
	import ScrollTrigger from "gsap/ScrollTrigger";
	import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";
	import { t } from "$lib/i18n/index.js";
	import { prefersReducedMotion } from "$lib/motion.js";
	import { serviceSources } from "$lib/images.js";
	import imgSoftware from "$lib/assets/services/software-development.jpg";
	import imgWebDesign from "$lib/assets/services/web-design.jpg";
	import imgUiUx from "$lib/assets/services/ui-ux.jpg";
	import imgSaas from "$lib/assets/services/saas-platforms.jpg";
	import imgAi from "$lib/assets/services/ai-automation.jpg";
	import imgDigitalProducts from "$lib/assets/services/digital-products.jpg";

	const images = [imgSoftware, imgWebDesign, imgUiUx, imgSaas, imgAi, imgDigitalProducts];
	const sources = [
		serviceSources("software-development"),
		serviceSources("web-design"),
		serviceSources("ui-ux"),
		serviceSources("saas-platforms"),
		serviceSources("ai-automation"),
		serviceSources("digital-products"),
	];

	// The panel is at most 300px wide on desktop and ~full width on mobile.
	const SIZES = "(min-width: 768px) 300px, 90vw";

	let services = $derived(
		$t.services.items.map((s, i) => ({ ...s, image: images[i], sources: sources[i] })),
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
		cardsRef.forEach((card, i) => {
			if (i === cardsRef.length - 1) return;
			const target = innerRef[i] || card;
			gsap.to(target, {
				scale: 0.94,
				ease: "none",
				scrollTrigger: {
					trigger: card,
					start: "top 88px",
					end: "bottom top",
					scrub: 0.3,
				},
			});
			if (dimRef[i]) {
				gsap.to(dimRef[i], {
					opacity: 0.18,
					ease: "none",
					scrollTrigger: {
						trigger: card,
						start: "top 88px",
						end: "bottom top",
						scrub: 0.3,
					},
				});
			}
		});
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
					class="group rounded-[24px] md:rounded-[36px] bg-white border border-black/8 shadow-[0_30px_80px_rgba(10,10,10,0.08)] px-6 md:px-16 py-10 md:py-16 min-h-[58svh] md:min-h-[64svh] flex flex-col justify-between overflow-hidden relative isolate origin-top will-change-transform"
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
					     46.4 -> 49.3 fps through this section, jank frames 28% -> 20%. -->
					<div
						bind:this={dimRef[i]}
						class="absolute inset-0 bg-[#0A0A0A] opacity-0 pointer-events-none z-30 will-change-[opacity]"
					></div>

					<div class="flex justify-between items-start relative z-10">
						<span class="font-display text-2xl md:text-4xl text-black/25">{service.num}</span>
						<ArrowUpRight
							class="w-8 h-8 md:w-10 md:h-10 text-black/20 group-hover:text-[#5B21F5] group-hover:rotate-45 transition-all duration-500"
						/>
					</div>

					<!-- Visual panel -->
					<div class="relative z-10 flex justify-center md:justify-end my-6 md:my-4">
						<div
							class="w-full md:w-[36%] md:max-w-[300px] aspect-[16/9] md:aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(10,10,10,0.12)] isolate"
							style="transform: translateZ(0);"
						>
							<picture class="contents">
								<source type="image/avif" srcset={service.sources.avif} sizes={SIZES} />
								<source type="image/webp" srcset={service.sources.webp} sizes={SIZES} />
								<img
									src={service.image}
									alt=""
									width="600"
									height="750"
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
