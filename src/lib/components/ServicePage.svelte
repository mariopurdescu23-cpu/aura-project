<script>
	import ArrowLeft from "@lucide/svelte/icons/arrow-left";
	import Check from "@lucide/svelte/icons/check";
	import { t } from "$lib/i18n/index.js";
	import { getServiceImage, serviceSlugs } from "$lib/serviceImages.js";
	import Seo from "$lib/components/Seo.svelte";
	import Process from "$lib/components/Process.svelte";
	import Cta from "$lib/components/Cta.svelte";

	let { slug } = $props();

	let index = $derived(serviceSlugs.indexOf(slug));
	let service = $derived($t.services.items[index]);
	let { image, sources } = getServiceImage(slug);

	const SIZES = "(min-width: 768px) 900px, 100vw";
</script>

<Seo
	title="{service.title} — Weberescu"
	description={service.desc}
	url="https://weberescu.ro/servicii/{slug}"
/>

<section class="w-full bg-white text-black pt-32 md:pt-44 pb-24 md:pb-32">
	<div class="max-w-4xl mx-auto px-6 md:px-12">
		<a
			href="/#services"
			class="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-black/40 hover:text-[#5B21F5] transition-colors mb-12 md:mb-16"
		>
			<ArrowLeft class="w-4 h-4" />
			{$t.services.backToServices}
		</a>

		<span class="font-mono text-sm text-black/30 mb-4 block">{service.num}</span>
		<h1 class="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] mb-8">{service.title}</h1>
		<p class="text-black/55 font-sans font-light text-lg md:text-xl leading-relaxed max-w-2xl mb-5">
			{service.desc}
		</p>
		<p class="text-black/55 font-sans font-light text-base md:text-lg leading-relaxed max-w-2xl mb-16 md:mb-20">
			{service.intro}
		</p>

		<div
			class="rounded-2xl md:rounded-3xl overflow-hidden aspect-[16/9] shadow-[0_30px_80px_rgba(10,10,10,0.1)] mb-16 md:mb-24 isolate"
			style="transform: translateZ(0);"
		>
			<picture>
				<source type="image/avif" srcset={sources.avif} sizes={SIZES} />
				<source type="image/webp" srcset={sources.webp} sizes={SIZES} />
				<img
					src={image}
					alt={service.title}
					width="1600"
					height="900"
					loading="eager"
					decoding="async"
					class="w-full h-full object-cover"
				/>
			</picture>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-10 md:gap-y-12">
			{#each service.features as feature}
				<div class="flex gap-4">
					<div
						class="w-8 h-8 rounded-full bg-[#5B21F5]/[0.08] text-[#5B21F5] flex items-center justify-center shrink-0"
					>
						<Check class="w-4 h-4" />
					</div>
					<div>
						<h3 class="font-display text-xl md:text-2xl mb-1.5">{feature.title}</h3>
						<p class="text-black/55 font-sans font-light leading-relaxed">{feature.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<Process />
<Cta />
