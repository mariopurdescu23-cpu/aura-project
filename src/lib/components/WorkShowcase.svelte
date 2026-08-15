<script>
	import { onMount } from "svelte";
	import gsap from "gsap";
	import ScrollTrigger from "gsap/ScrollTrigger";
	import imgCabana from "$lib/assets/work/cabana-svinita.jpg";
	import imgRodica from "$lib/assets/work/rodica-chiriches.jpg";
	import imgSeeker from "$lib/assets/work/seeker.jpg";
	import imgMysticpuff from "$lib/assets/work/mysticpuff.jpg";
	import { fillPress } from "$lib/actions/fillPress.js";
	import { scrollToSection } from "$lib/scrollTo.js";
	import { t } from "$lib/i18n/index.js";

	// Layout-only data (images, sizing, asymmetric grid placement) stays
	// static — only the copy (name/category/desc/tech/year/url) is translated.
	const layout = [
		{ image: imgCabana, height: "h-[62vh] md:h-[78vh]", colStart: "md:col-start-1", colSpan: "md:col-span-7", offsetTop: "" },
		{ image: imgRodica, height: "h-[52vh] md:h-[60vh]", colStart: "md:col-start-6", colSpan: "md:col-span-7", offsetTop: "md:mt-24" },
		{ image: imgSeeker, height: "h-[58vh] md:h-[70vh]", colStart: "md:col-start-1", colSpan: "md:col-span-6", offsetTop: "md:mt-32" },
		{ image: imgMysticpuff, height: "h-[54vh] md:h-[62vh]", colStart: "md:col-start-7", colSpan: "md:col-span-6", offsetTop: "md:mt-4" },
	];

	let projects = $derived($t.work.projects.map((p, i) => ({ ...p, ...layout[i] })));

	let cardRefs = $state([]);

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		cardRefs.forEach((card) => {
			if (!card) return;
			gsap.fromTo(
				card,
				{ y: 80, autoAlpha: 0 },
				{
					y: 0,
					autoAlpha: 1,
					duration: 1.1,
					ease: "power3.out",
					scrollTrigger: { trigger: card, start: "top 88%" },
				},
			);
		});
	});

	// Note: the project images used to shift slightly on mousemove (a small
	// parallax effect). Removed — it could visibly drift on its own on fast
	// mouse movement / rapid enter-leave sequences, which read as a bug.
	// The images now stay put; only the CSS group-hover scale remains.
</script>

<section id="work" class="w-full bg-white text-black py-24 md:py-40 relative">
	<div
		class="px-6 md:px-12 max-w-7xl mx-auto mb-14 md:mb-28 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
	>
		<h2 class="font-display text-6xl sm:text-7xl md:text-8xl tracking-tight leading-[0.95]">
			{$t.work.title1}<br /><span class="font-serif-italic text-black/35">{$t.work.title2}</span>
		</h2>
		<p class="text-black/50 font-sans max-w-sm text-base md:text-lg leading-relaxed pb-2">
			{$t.work.desc}
		</p>
	</div>

	<div class="px-4 md:px-8 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-16 md:gap-y-6">
		{#each projects as project, i}
			<a
				href={project.url}
				target="_blank"
				rel="noopener noreferrer"
				bind:this={cardRefs[i]}
				data-cursor-label={$t.work.viewProject}
				class="group col-span-1 {project.colSpan} {project.colStart} {project.offsetTop} block cursor-pointer"
			>
				<div class="relative overflow-hidden rounded-2xl {project.height} bg-[#F7F7F8]">
					<img
						src={project.image}
						alt="{project.name} — {project.category}"
						class="absolute inset-0 w-[112%] h-[112%] -left-[6%] -top-[6%] object-cover scale-105 group-hover:scale-110 transition-transform duration-700 will-change-transform"
					/>
					<!-- On mobile there's no hover, so this overlay (and the tags below)
					     stay permanently visible; on desktop it still only shows on hover. -->
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"
					></div>
					<div
						class="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-0 md:translate-y-6 opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500 flex items-center justify-between gap-3"
					>
						<span class="text-white text-sm font-mono uppercase tracking-widest">{project.tech}</span>
						<span
							class="md:hidden flex-shrink-0 inline-flex items-center gap-1.5 text-white text-xs font-mono uppercase tracking-widest bg-[#5B21F5] rounded-full px-3 py-1.5"
							>{$t.work.viewProject} →</span
						>
					</div>
					<span
						class="absolute top-5 right-5 md:top-6 md:right-6 text-xs font-mono uppercase tracking-widest text-white bg-[#5B21F5] rounded-full px-3 py-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"
						>{project.year}</span
					>
				</div>

				<div class="flex items-end justify-between mt-6 gap-6">
					<div>
						<div class="flex items-baseline gap-3">
							<span class="font-mono text-xs text-black/30">{project.id}</span>
							<h3 class="font-display text-3xl md:text-5xl group-hover:text-[#5B21F5] transition-colors duration-300">
								{project.name}
							</h3>
						</div>
						<p class="text-black/45 font-sans font-light mt-1">{project.category}</p>
					</div>
					<p class="hidden md:block text-black/40 text-sm max-w-[220px] leading-relaxed text-right">
						{project.desc}
					</p>
				</div>
			</a>
		{/each}
	</div>

	<div class="flex justify-center mt-16 md:mt-24">
		<a
			href="#contact"
			onclick={(e) => scrollToSection(e, "#contact")}
			use:fillPress
			class="px-8 py-4 rounded-full border border-black/15 text-black/70 hover:bg-black hover:text-white hover:border-black transition-colors duration-500 font-sans text-sm font-medium"
		>
			{$t.work.cta}
		</a>
	</div>
</section>
