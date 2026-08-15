<script>
	import { onMount } from "svelte";
	import gsap from "gsap";
	import ScrollTrigger from "gsap/ScrollTrigger";

	let statsRef = $state();

	const stats = [
		{ label: "Projects delivered", value: 12, suffix: "+", isNumber: true },
		{ label: "Years of craft", value: 7, suffix: "+", isNumber: true },
		{ label: "In-house delivery", value: 100, suffix: "%", isNumber: true },
		{ label: "Curiosity", value: "∞", suffix: "", isNumber: false },
	];

	const principles = [
		{ n: "01", title: "Craft over speed", desc: "We'd rather ship a week later and get it right." },
		{ n: "02", title: "Design and code together", desc: "The same people who design it help build it." },
		{ n: "03", title: "No filler, no fluff", desc: "Every screen, sentence and animation earns its place." },
	];

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const counters = statsRef.querySelectorAll(".counterData");
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

<section id="about" class="w-full bg-white text-black py-28 md:py-40 border-t border-black/5">
	<div class="max-w-7xl mx-auto px-6 md:px-12">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12 mb-24 md:mb-32">
			<div>
				<span class="text-xs font-mono text-black/40 uppercase tracking-widest mb-6 block">About</span>
				<h2 class="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
					SMALL TEAM.<br />BIG DIGITAL<br /><span class="font-serif-italic text-[#5B21F5]">energy.</span>
				</h2>
			</div>
			<div class="flex flex-col justify-end gap-10">
				<p class="text-lg md:text-xl text-black/55 font-sans font-light leading-relaxed max-w-lg">
					Weberescu is an independent studio for companies who take their product seriously.
					We work in small, senior teams — no account managers, no hand-offs, no dilution
					between the deck that sells the work and the people who actually build it.
				</p>
				<div class="flex flex-col gap-6">
					{#each principles as p}
						<div class="flex gap-6 items-start border-t border-black/10 pt-4">
							<span class="font-mono text-xs text-black/30 mt-1">{p.n}</span>
							<div>
								<h4 class="font-display text-lg mb-1">{p.title}</h4>
								<p class="text-black/50 font-sans text-sm font-light">{p.desc}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div
			bind:this={statsRef}
			class="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 border-t border-black/10 pt-14"
		>
			{#each stats as stat}
				<div class="flex flex-col gap-2">
					<h4 class="font-display text-5xl md:text-6xl tracking-tight text-[#5B21F5] flex items-baseline">
						<span class="counterData">{stat.isNumber ? 0 : stat.value}</span><span class="text-black/70">{stat.suffix}</span>
					</h4>
					<p class="text-xs font-mono text-black/40 uppercase tracking-widest">{stat.label}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
