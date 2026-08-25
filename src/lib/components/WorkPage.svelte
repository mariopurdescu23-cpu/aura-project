<script>
	import ArrowLeft from "@lucide/svelte/icons/arrow-left";
	import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";
	import Check from "@lucide/svelte/icons/check";
	import { t } from "$lib/i18n/index.js";
	import { getWorkImage, workSlugs } from "$lib/workImages.js";
	import Seo from "$lib/components/Seo.svelte";
	import Process from "$lib/components/Process.svelte";
	import Testimonials from "$lib/components/Testimonials.svelte";
	import Cta from "$lib/components/Cta.svelte";

	let { slug } = $props();

	let index = $derived(workSlugs.indexOf(slug));
	let project = $derived($t.work.projects[index]);
	let { image, sources } = getWorkImage(slug);

	const SIZES = "(min-width: 768px) 900px, 100vw";
</script>

<Seo
	title="{project.name} — Weberescu"
	description={project.desc}
	url="https://weberescu.ro/lucrari/{slug}"
/>

<section class="w-full bg-white text-black pt-32 md:pt-44 pb-24 md:pb-32">
	<div class="max-w-4xl mx-auto px-6 md:px-12">
		<a
			href="/#work"
			class="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-black/40 hover:text-[#5B21F5] transition-colors mb-12 md:mb-16"
		>
			<ArrowLeft class="w-4 h-4" />
			{$t.work.backToWork}
		</a>

		<div class="flex items-center gap-3 mb-4">
			<span class="font-mono text-sm text-black/30">{project.id}</span>
			<span class="text-xs font-mono text-black/40 uppercase tracking-widest">{project.year}</span>
		</div>
		<h1 class="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] mb-3">{project.name}</h1>
		<p class="text-black/45 font-sans font-light text-lg mb-8">{project.category}</p>

		<p class="text-black/55 font-sans font-light text-lg md:text-xl leading-relaxed max-w-2xl mb-5">
			{project.desc}
		</p>
		<p class="text-black/55 font-sans font-light text-base md:text-lg leading-relaxed max-w-2xl mb-10">
			{project.intro}
		</p>

		<a
			href={project.url}
			target="_blank"
			rel="noopener noreferrer"
			data-cursor-label={$t.work.viewLive}
			class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#5B21F5] text-white font-sans text-sm font-medium hover:bg-[#0A0A0A] transition-colors duration-300 mb-16 md:mb-20"
		>
			{$t.work.viewLive}
			<ArrowUpRight class="w-4 h-4" />
		</a>

		<div
			class="rounded-2xl md:rounded-3xl overflow-hidden aspect-[16/9] shadow-[0_30px_80px_rgba(10,10,10,0.1)] mb-16 md:mb-24 isolate"
			style="transform: translateZ(0);"
		>
			<picture>
				<source type="image/avif" srcset={sources.avif} sizes={SIZES} />
				<source type="image/webp" srcset={sources.webp} sizes={SIZES} />
				<img
					src={image}
					alt="{project.name} — {project.category}"
					width="1600"
					height="900"
					loading="eager"
					decoding="async"
					class="w-full h-full object-cover"
				/>
			</picture>
		</div>

		<span class="text-xs font-mono text-black/40 uppercase tracking-widest mb-6 block">{project.tech}</span>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-10 md:gap-y-12">
			{#each project.highlights as h}
				<div class="flex gap-4">
					<div
						class="w-8 h-8 rounded-full bg-[#5B21F5]/[0.08] text-[#5B21F5] flex items-center justify-center shrink-0"
					>
						<Check class="w-4 h-4" />
					</div>
					<div>
						<h3 class="font-display text-xl md:text-2xl mb-1.5">{h.title}</h3>
						<p class="text-black/55 font-sans font-light leading-relaxed">{h.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<Process />
<Testimonials />
<Cta />
