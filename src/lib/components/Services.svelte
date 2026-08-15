<script>
	import { onMount } from "svelte";
	import gsap from "gsap";
	import ScrollTrigger from "gsap/ScrollTrigger";
	import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";
	import { t } from "$lib/i18n/index.js";
	import imgSoftware from "$lib/assets/services/software-development.jpg";
	import imgWebDesign from "$lib/assets/services/web-design.jpg";
	import imgUiUx from "$lib/assets/services/ui-ux.jpg";
	import imgSaas from "$lib/assets/services/saas-platforms.jpg";
	import imgAi from "$lib/assets/services/ai-automation.jpg";
	import imgDigitalProducts from "$lib/assets/services/digital-products.jpg";

	const images = [imgSoftware, imgWebDesign, imgUiUx, imgSaas, imgAi, imgDigitalProducts];

	let services = $derived($t.services.items.map((s, i) => ({ ...s, image: images[i] })));
	let cardsRef = $state([]);
	let sectionRef = $state();

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		cardsRef.forEach((card, i) => {
			if (i === cardsRef.length - 1) return;
			gsap.to(card, {
				scale: 0.94,
				filter: "brightness(0.85)",
				ease: "none",
				scrollTrigger: {
					trigger: card,
					start: "top 88px",
					end: "bottom top",
					scrub: true,
				},
			});
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
				class="sticky top-[72px] md:top-[88px] mb-5 md:mb-6 origin-top will-change-transform"
				style="z-index: {i + 1};"
			>
				<div
					class="group rounded-[24px] md:rounded-[36px] bg-white border border-black/8 shadow-[0_30px_80px_rgba(10,10,10,0.08)] px-6 md:px-16 py-10 md:py-16 min-h-[58vh] md:min-h-[64vh] flex flex-col justify-between overflow-hidden relative"
				>
					<div
						class="absolute -top-24 -right-24 w-[340px] h-[340px] rounded-full bg-[#5B21F5] opacity-0 group-hover:opacity-[0.06] blur-[80px] transition-opacity duration-700 pointer-events-none"
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
							class="w-full md:w-[36%] md:max-w-[300px] aspect-[16/9] md:aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(10,10,10,0.12)]"
						>
							<img
								src={service.image}
								alt=""
								class="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 will-change-transform"
							/>
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
