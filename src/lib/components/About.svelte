<script>
	import { t } from "$lib/i18n/index.js";

	let paragraphs = $derived($t.about.paragraphs);
	let principles = $derived($t.about.principles);
</script>

<section id="about" class="w-full bg-white text-black py-24 md:py-40 border-t border-black/5">
	<div class="max-w-7xl mx-auto px-6 md:px-12">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-12 mb-16 md:mb-32">
			<div>
				<span class="text-xs font-mono text-black/40 uppercase tracking-widest mb-6 block">{$t.about.label}</span>
				<h2 class="font-display text-4xl sm:text-5xl md:text-7xl leading-[0.95] tracking-tight">
					{$t.about.title}
				</h2>
			</div>
			<div class="flex flex-col justify-end gap-8 md:gap-10">
				<div class="flex flex-col gap-4">
					{#each paragraphs as paragraph}
						<p class="text-base md:text-xl text-black/55 font-sans font-light leading-relaxed max-w-lg">
							{paragraph}
						</p>
					{/each}
				</div>
				<div class="flex flex-col gap-6">
					{#each principles as p}
						<div class="flex gap-6 items-start border-t border-black/10 pt-4">
							<span class="font-mono text-xs text-black/30 mt-1">{p.n}</span>
							<div>
								<h3 class="font-display text-lg mb-1">{p.title}</h3>
								<p class="text-black/50 font-sans text-sm font-light">{p.desc}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
