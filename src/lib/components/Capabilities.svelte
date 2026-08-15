<script>
	import { onMount } from "svelte";
	import gsap from "gsap";

	let rowRef = $state();

	const tickerItems = [
		"Software Development",
		"Web Design",
		"UI / UX",
		"SaaS & Platforms",
		"AI & Automation",
		"Digital Products",
	];
	const tickerLoop = [...tickerItems, ...tickerItems];

	const stack = [
		{
			label: "Frontend",
			items: [
				{ name: "Svelte", weight: "big", accent: true },
				{ name: "React", weight: "med" },
				{ name: "Next.js", weight: "big" },
				{ name: "TypeScript", weight: "sm" },
				{ name: "Three.js", weight: "med", accent: true },
				{ name: "GSAP", weight: "sm" },
			],
		},
		{
			label: "Backend",
			items: [
				{ name: "Node.js", weight: "big" },
				{ name: "Python", weight: "med", accent: true },
				{ name: "PostgreSQL", weight: "sm" },
				{ name: "REST / GraphQL", weight: "sm" },
				{ name: "Edge Functions", weight: "med" },
			],
		},
		{
			label: "AI",
			items: [
				{ name: "OpenAI", weight: "big", accent: true },
				{ name: "LLM Integrations", weight: "med" },
				{ name: "RAG Pipelines", weight: "sm" },
				{ name: "Automation", weight: "big" },
			],
		},
		{
			label: "Design",
			items: [
				{ name: "Figma", weight: "big" },
				{ name: "Prototyping", weight: "sm" },
				{ name: "Design Systems", weight: "med", accent: true },
				{ name: "Motion Design", weight: "sm" },
			],
		},
	];

	const weightClass = {
		sm: "text-lg md:text-2xl",
		med: "text-2xl md:text-4xl",
		big: "text-3xl md:text-5xl",
	};

	onMount(() => {
		gsap.to(rowRef, { xPercent: -50, repeat: -1, duration: 26, ease: "none" });
	});
</script>

<section id="capabilities" class="w-full bg-[#0A0A0A] text-white relative overflow-hidden">
	<!-- Ticker band -->
	<div class="border-b border-white/10 py-6 overflow-hidden flex">
		<div bind:this={rowRef} class="flex whitespace-nowrap will-change-transform w-fit">
			<div class="flex gap-10 md:gap-16 items-center pr-10 md:pr-16">
				{#each tickerLoop as item, i}
					<div class="flex items-center gap-10 md:gap-16">
						<span class="font-display text-xl md:text-2xl text-white/50 uppercase tracking-tight"
							>{item}</span
						>
						<span class="text-[#7C3AED] text-xl">—</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-6 md:px-24 py-28 md:py-40">
		<div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-20">
			<span class="text-xs font-mono text-white/40 uppercase tracking-widest">Capabilities</span>
			<h2 class="font-display text-3xl md:text-5xl leading-tight text-right md:text-right max-w-xl">
				The tools we reach for<br /><span class="font-serif-italic text-white/40">when it matters.</span>
			</h2>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
			{#each stack as group}
				<div class="flex flex-col gap-6 border-t border-white/10 pt-6">
					<span class="text-xs font-mono text-[#a78bfa] uppercase tracking-widest">{group.label}</span>
					<div class="flex flex-wrap gap-x-4 gap-y-2 items-baseline">
						{#each group.items as item, i}
							<span
								class="font-display {weightClass[item.weight]} leading-none transition-colors duration-300 cursor-default {item.accent
									? 'text-[#a78bfa] hover:text-white'
									: 'text-white/70 hover:text-white'}"
							>
								{item.name}{i < group.items.length - 1 ? "," : ""}
							</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
