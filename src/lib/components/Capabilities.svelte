<script>
	import { t } from "$lib/i18n/index.js";

	let stack = $derived($t.capabilities.groups);

	const weightClass = {
		sm: "text-lg md:text-2xl",
		med: "text-2xl md:text-4xl",
		big: "text-3xl md:text-5xl",
	};
</script>

<section id="capabilities" class="w-full bg-[#0A0A0A] text-white relative overflow-hidden">
	<div class="max-w-7xl mx-auto px-6 md:px-24 py-20 md:py-40">
		<div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14 md:mb-20">
			<span class="text-xs font-mono text-white/40 uppercase tracking-widest">{$t.capabilities.label}</span>
			<h2 class="font-display text-3xl md:text-5xl leading-tight md:text-right max-w-xl">
				{$t.capabilities.title1}<br /><span class="font-serif-italic text-white/40">{$t.capabilities.title2}</span>
			</h2>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
			{#each stack as group}
				<div class="flex flex-col gap-5 md:gap-6 border-t border-white/10 pt-5 md:pt-6">
					<span class="text-xs font-mono text-[#a78bfa] uppercase tracking-widest">{group.label}</span>
					<div class="flex flex-wrap gap-x-3 md:gap-x-4 gap-y-2 items-baseline">
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
