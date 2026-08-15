<script>
	import gsap from "gsap";
	import ScrollTrigger from "gsap/ScrollTrigger";
	import { t } from "$lib/i18n/index.js";

	let manifestoRef = $state();

	let words = $derived($t.manifesto.text.split(" "));
	let accentWords = $derived($t.manifesto.accents);

	// Re-runs whenever the language (and therefore word count) changes —
	// tears down the previous ScrollTrigger before building the new one.
	$effect(() => {
		const currentWords = words;
		const currentAccents = accentWords;
		if (!manifestoRef) return;

		gsap.registerPlugin(ScrollTrigger);

		const spans = Array.from(manifestoRef.querySelectorAll(".word"));
		const normal = spans.filter((s) => !currentAccents.includes(s.dataset.word));
		const accent = spans.filter((s) => currentAccents.includes(s.dataset.word));

		const trigger = {
			trigger: manifestoRef,
			start: "top 80%",
			end: "center center",
			scrub: 1,
		};

		const tw1 = gsap.to(normal, { color: "#0a0a0a", stagger: 0.1, ease: "none", scrollTrigger: trigger });
		const tw2 = gsap.to(accent, { color: "#5B21F5", stagger: 0.1, ease: "none", scrollTrigger: trigger });

		return () => {
			tw1.scrollTrigger?.kill();
			tw2.scrollTrigger?.kill();
			tw1.kill();
			tw2.kill();
		};
	});
</script>

<section
	id="manifesto"
	class="w-full bg-white text-black py-32 md:py-48 px-6 md:px-24 flex flex-col items-center justify-center border-t border-black/5 relative"
>
	<span class="text-xs font-mono text-black/30 uppercase tracking-widest mb-16 text-center">
		{$t.manifesto.label}
	</span>

	<p
		bind:this={manifestoRef}
		class="font-display text-3xl md:text-5xl lg:text-6xl text-center max-w-5xl w-full flex flex-wrap justify-center gap-x-3 gap-y-2 md:gap-y-4 leading-[1.15]"
	>
		{#each words as word}
			<span
				class="word text-black/10 pointer-events-none"
				data-word={word}
				>{word}
			</span>
		{/each}
	</p>
</section>
