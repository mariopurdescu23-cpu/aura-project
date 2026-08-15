<script>
	import { onMount } from "svelte";
	import gsap from "gsap";
	import ScrollTrigger from "gsap/ScrollTrigger";
	import imgNova from "$lib/assets/work/nova.jpg";
	import imgLuma from "$lib/assets/work/luma.jpg";
	import imgOrbit from "$lib/assets/work/orbit.jpg";
	import imgMono from "$lib/assets/work/mono.jpg";
	import imgArc from "$lib/assets/work/arc.jpg";

	const projects = [
		{
			id: "01",
			name: "NOVA",
			category: "SaaS Platform",
			year: "2026",
			desc: "Multi-tenant analytics platform with real-time dashboards, rebuilt for a company scaling past its first 10,000 users.",
			tech: "Svelte · Node · PostgreSQL",
			image: imgNova,
			height: "h-[62vh] md:h-[78vh]",
			colStart: "md:col-start-1",
			colSpan: "md:col-span-7",
			offsetTop: "",
		},
		{
			id: "02",
			name: "LUMA",
			category: "Fintech Experience",
			year: "2025",
			desc: "An investment product redesigned around clarity and trust — fewer numbers on screen, more confidence in the decision.",
			tech: "Next.js · TypeScript · Figma",
			image: imgLuma,
			height: "h-[52vh] md:h-[60vh]",
			colStart: "md:col-start-6",
			colSpan: "md:col-span-7",
			offsetTop: "md:mt-24",
		},
		{
			id: "03",
			name: "ORBIT",
			category: "AI Product",
			year: "2025",
			desc: "A conversational AI assistant embedded across a SaaS suite, trained to answer with the product's own data.",
			tech: "Python · OpenAI · React",
			image: imgOrbit,
			height: "h-[58vh] md:h-[70vh]",
			colStart: "md:col-start-1",
			colSpan: "md:col-span-6",
			offsetTop: "md:mt-32",
		},
		{
			id: "04",
			name: "MONO",
			category: "E-commerce Platform",
			year: "2024",
			desc: "A headless commerce experience built for scale, with a checkout fast enough to keep up with a viral launch.",
			tech: "SvelteKit · Shopify · GSAP",
			image: imgMono,
			height: "h-[50vh] md:h-[58vh]",
			colStart: "md:col-start-7",
			colSpan: "md:col-span-6",
			offsetTop: "md:mt-4",
		},
		{
			id: "05",
			name: "ARC",
			category: "Digital Product",
			year: "2024",
			desc: "A design system and full product suite for a hardware startup shipping its first consumer device.",
			tech: "Figma · React · Three.js",
			image: imgArc,
			height: "h-[60vh] md:h-[74vh]",
			colStart: "md:col-start-3",
			colSpan: "md:col-span-8",
			offsetTop: "md:mt-28",
		},
	];

	let cardRefs = $state([]);
	let imgRefs = $state([]);

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

	function handleMove(e, i) {
		const img = imgRefs[i];
		if (!img || window.innerWidth < 768) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const relX = (e.clientX - rect.left) / rect.width - 0.5;
		const relY = (e.clientY - rect.top) / rect.height - 0.5;
		gsap.to(img, { x: relX * 24, y: relY * 24, duration: 0.9, ease: "power3.out" });
	}

	function handleLeave(i) {
		const img = imgRefs[i];
		if (!img) return;
		gsap.to(img, { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
	}
</script>

<section id="work" class="w-full bg-white text-black py-28 md:py-40 relative">
	<div
		class="px-6 md:px-12 max-w-7xl mx-auto mb-20 md:mb-28 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
	>
		<h2 class="font-display text-5xl md:text-8xl tracking-tight leading-[0.95]">
			Selected<br /><span class="font-serif-italic text-black/35">work.</span>
		</h2>
		<p class="text-black/50 font-sans max-w-sm text-lg leading-relaxed pb-2">
			A handful of the products, platforms and experiences we've shipped.
			Illustrative work — hover for detail.
		</p>
	</div>

	<div class="px-4 md:px-8 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-24 md:gap-y-6">
		{#each projects as project, i}
			<a
				href="#contact"
				bind:this={cardRefs[i]}
				data-cursor-label="View project"
				onmousemove={(e) => handleMove(e, i)}
				onmouseleave={() => handleLeave(i)}
				class="group col-span-1 {project.colSpan} {project.colStart} {project.offsetTop} block cursor-pointer"
			>
				<div class="relative overflow-hidden rounded-2xl {project.height} bg-[#F7F7F8]">
					<img
						bind:this={imgRefs[i]}
						src={project.image}
						alt="{project.name} — {project.category}"
						class="absolute inset-0 w-[112%] h-[112%] -left-[6%] -top-[6%] object-cover scale-105 group-hover:scale-110 transition-transform duration-700 will-change-transform"
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
					></div>
					<div
						class="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
					>
						<span class="text-white text-sm font-mono uppercase tracking-widest">{project.tech}</span>
					</div>
					<span
						class="absolute top-5 right-5 md:top-6 md:right-6 text-xs font-mono uppercase tracking-widest text-white bg-[#5B21F5] rounded-full px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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

	<div class="flex justify-center mt-24">
		<a
			href="#contact"
			onclick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
			class="px-8 py-4 rounded-full border border-black/15 text-black/70 hover:bg-black hover:text-white hover:border-black transition-colors duration-500 font-sans text-sm font-medium"
		>
			Start your project →
		</a>
	</div>
</section>
