<script>
	import { onMount } from "svelte";
	import gsap from "gsap";
	import ScrollTrigger from "gsap/ScrollTrigger";
	import { t } from "$lib/i18n/index.js";
	import { prefersReducedMotion } from "$lib/motion.js";

	let statsRef = $state();

	let stats = $derived($t.about.stats);
	let principles = $derived($t.about.principles);

	onMount(() => {
		const counters = statsRef.querySelectorAll(".counterData");

		// The numeric stats render as `0` and count up on scroll. Skipping the
		// animation without writing the final values would leave the section
		// permanently showing zeros.
		if (prefersReducedMotion()) {
			counters.forEach((counter, i) => {
				counter.innerText = stats[i].value;
			});
			gsap.set(counters, { autoAlpha: 1, scale: 1 });
			return;
		}

		gsap.registerPlugin(ScrollTrigger);

		counters.forEach((counter, i) => {
			const stat = stats[i];
			if (!stat.isNumber) {
				gsap.fromTo(
					counter,
					{ autoAlpha: 0, scale: 0.6 },
					{
						autoAlpha: 1,
						scale: 1,
						duration: 0.8,
						ease: "back.out(2)",
						scrollTrigger: { trigger: statsRef, start: "top 80%" },
					},
				);
				return;
			}
			let obj = { val: 0 };
			gsap.to(obj, {
				val: stat.value,
				duration: 1.8,
				ease: "power2.out",
				scrollTrigger: { trigger: statsRef, start: "top 80%" },
				onUpdate: () => {
					counter.innerText = Math.ceil(obj.val);
				},
			});
		});
	});
</script>

<section id="about" class="w-full bg-white text-black py-24 md:py-40 border-t border-black/5">
	<div class="max-w-7xl mx-auto px-6 md:px-12">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-12 mb-16 md:mb-32">
			<div>
				<span class="text-xs font-mono text-black/40 uppercase tracking-widest mb-6 block">{$t.about.label}</span>
				<h2 class="font-display text-4xl sm:text-5xl md:text-7xl leading-[0.95] tracking-tight">
					{$t.about.headline[0]}<br />{$t.about.headline[1]}<br /><span class="font-serif-italic text-[#5B21F5]">{$t.about.headline[2]}</span>
				</h2>
			</div>
			<div class="flex flex-col justify-end gap-8 md:gap-10">
				<p class="text-base md:text-xl text-black/55 font-sans font-light leading-relaxed max-w-lg">
					{$t.about.desc}
				</p>
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

		<div
			bind:this={statsRef}
			class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-8 border-t border-black/10 pt-10 md:pt-14"
		>
			{#each stats as stat}
				<div class="flex flex-col gap-2">
					<h3 class="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight text-[#5B21F5] flex items-baseline">
						<span class="counterData">{stat.isNumber ? 0 : stat.value}</span><span class="text-black/70">{stat.suffix}</span>
					</h3>
					<p class="text-xs font-mono text-black/40 uppercase tracking-widest">{stat.label}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
