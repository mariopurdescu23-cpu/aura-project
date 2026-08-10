<script>
	import Check from "@lucide/svelte/icons/check";
	import { scrollToSection } from "$lib/scrollTo.js";

	const packages = [
		{
			name: "Start",
			price: "1.000 lei",
			desc: "Site de prezentare, 4–5 pagini",
			features: [
				"Design pe măsură",
				"Formular de contact și hartă",
				"Optimizare pentru telefon",
				"Livrare în 10–14 zile",
			],
			featured: false,
		},
		{
			name: "Complet",
			price: "2.400 lei",
			desc: "Site extins, texte scrise de noi",
			features: [
				"Tot ce e în pachetul Start",
				"Texte optimizate SEO",
				"Blog și pagini de servicii",
				"30 de zile de ajustări incluse",
			],
			featured: true,
		},
		{
			name: "Magazin",
			price: "5.000 lei",
			desc: "Magazin online complet",
			features: [
				"Catalog și pagini de produs",
				"Plată cu cardul și ramburs",
				"Curieri și facturare",
				"Instruire pentru echipa ta",
			],
			featured: false,
		},
	];
</script>

<section
	id="pricing"
	class="w-full bg-[#050505] text-white py-32 border-t border-white/10 relative overflow-hidden"
>
	<div
		class="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3B82F6] opacity-5 blur-[180px] rounded-full pointer-events-none"
	></div>

	<div class="px-6 md:px-24 max-w-7xl mx-auto relative z-10">
		<div class="text-center mb-20">
			<span
				class="text-sm font-mono text-white/50 uppercase tracking-widest mb-6 block"
				>Pachete</span
			>
			<h2 class="text-4xl md:text-6xl font-serif leading-tight">
				Prețuri spuse<br />
				<span class="italic text-white/40">de la început.</span>
			</h2>
			<p class="text-white/50 mt-6 font-sans font-light max-w-xl mx-auto">
				După discuția inițială primești o ofertă fermă, nu o estimare.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each packages as pkg}
				<div
					class="relative flex flex-col p-8 rounded-3xl border transition-all duration-500 {pkg.featured
						? 'border-[#3B82F6] bg-[#3B82F6]/[0.06] md:-translate-y-4'
						: 'border-white/10 bg-white/[0.02] hover:border-white/20'}"
				>
					{#if pkg.featured}
						<span
							class="absolute -top-3 left-8 px-3 py-1 rounded-full bg-[#3B82F6] text-white text-xs font-mono uppercase tracking-wide"
						>
							Cel mai ales
						</span>
					{/if}

					<h3 class="font-serif text-2xl mb-1">{pkg.name}</h3>
					<p class="text-white/40 font-sans text-sm mb-6">{pkg.desc}</p>

					<div class="mb-8">
						<span class="text-4xl md:text-5xl font-serif">{pkg.price}</span>
					</div>

					<ul class="flex flex-col gap-3 mb-10 flex-1">
						{#each pkg.features as feature}
							<li
								class="flex items-start gap-3 text-white/70 font-sans text-sm"
							>
								<Check
									class="w-4 h-4 mt-0.5 shrink-0 {pkg.featured
										? 'text-[#3B82F6]'
										: 'text-white/40'}"
								/>
								{feature}
							</li>
						{/each}
					</ul>

					<a
						href="#contact"
						onclick={(e) => scrollToSection(e, "#contact")}
						class="text-center px-6 py-4 rounded-full font-sans font-medium transition-all duration-500 cursor-pointer {pkg.featured
							? 'bg-[#3B82F6] text-white hover:bg-[#2563EB]'
							: 'bg-white text-black hover:bg-white/90'}"
					>
						Cere oferta
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>
