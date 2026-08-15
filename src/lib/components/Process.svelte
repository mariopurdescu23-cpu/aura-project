<script>
	import { onMount } from "svelte";
	import gsap from "gsap";
	import ScrollTrigger from "gsap/ScrollTrigger";
	import { t } from "$lib/i18n/index.js";
	import { prefersReducedMotion } from "$lib/motion.js";

	let steps = $derived($t.process.steps);

	let sectionRef = $state();
	let lineRef = $state();
	let stepRefs = $state([]);

	onMount(() => {
		// The timeline rail ships as `scale-y-0` and the step blocks as
		// `autoAlpha: 0`, so with animations skipped they have to be put into
		// their finished state by hand or the section renders half-empty.
		if (prefersReducedMotion()) {
			gsap.set(lineRef, { scaleY: 1 });
			gsap.set(stepRefs, { x: 0, autoAlpha: 1 });
			return;
		}

		gsap.registerPlugin(ScrollTrigger);

		gsap.fromTo(
			lineRef,
			{ scaleY: 0 },
			{
				scaleY: 1,
				ease: "none",
				transformOrigin: "top",
				scrollTrigger: {
					trigger: sectionRef,
					start: "top 70%",
					end: "bottom 60%",
					scrub: 0.6,
				},
			},
		);

		stepRefs.forEach((step) => {
			if (!step) return;
			gsap.fromTo(
				step,
				{ x: -24, autoAlpha: 0 },
				{
					x: 0,
					autoAlpha: 1,
					duration: 0.9,
					ease: "power3.out",
					scrollTrigger: { trigger: step, start: "top 82%" },
				},
			);
		});
	});
</script>

<section bind:this={sectionRef} class="w-full bg-[#F7F7F8] text-black py-24 md:py-40 relative overflow-hidden">
	<div class="max-w-7xl mx-auto px-6 md:px-12">
		<div class="mb-16 md:mb-28">
			<span class="text-xs font-mono text-black/40 uppercase tracking-widest mb-6 block">{$t.process.label}</span>
			<h2 class="font-display text-4xl md:text-6xl leading-tight max-w-2xl">
				{$t.process.title1}<br /><span class="font-serif-italic text-black/40">{$t.process.title2}</span>
			</h2>
		</div>

		<div class="relative max-w-3xl">
			<div class="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-px bg-black/10"></div>
			<div
				bind:this={lineRef}
				class="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-px bg-[#5B21F5] origin-top scale-y-0"
			></div>

			<div class="flex flex-col gap-12 md:gap-20">
				{#each steps as step, i}
					<div bind:this={stepRefs[i]} class="relative pl-14 md:pl-20">
						<div
							class="absolute left-0 top-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-black/15 flex items-center justify-center font-mono text-xs text-black/50 z-10"
						>
							{step.n}
						</div>
						<h3 class="font-display text-3xl md:text-5xl mb-3">{step.title}</h3>
						<p class="text-black/55 font-sans font-light text-base md:text-lg max-w-lg leading-relaxed">
							{step.desc}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
