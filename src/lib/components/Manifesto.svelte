<script>
	import { onMount } from "svelte";
	import gsap from "gsap";
	import ScrollTrigger from "gsap/ScrollTrigger";

	const paragraph =
		"We don't just build websites. We build digital experiences people remember — engineered with the same rigor a product team would bring to software, and the same care a studio would bring to design.";
	const words = paragraph.split(" ");
	const accentWords = ["experiences", "remember", "software,", "design."];

	let manifestoRef = $state();

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const spans = Array.from(manifestoRef.querySelectorAll(".word"));
		const normal = spans.filter((s) => !accentWords.includes(s.dataset.word));
		const accent = spans.filter((s) => accentWords.includes(s.dataset.word));

		const trigger = {
			trigger: manifestoRef,
			start: "top 80%",
			end: "center center",
			scrub: 1,
		};

		gsap.to(normal, { color: "#0a0a0a", stagger: 0.1, ease: "none", scrollTrigger: trigger });
		gsap.to(accent, { color: "#5B21F5", stagger: 0.1, ease: "none", scrollTrigger: trigger });
	});
</script>

<section
	id="manifesto"
	class="w-full bg-white text-black py-32 md:py-48 px-6 md:px-24 flex flex-col items-center justify-center border-t border-black/5 relative"
>
	<span class="text-xs font-mono text-black/30 uppercase tracking-widest mb-16 text-center">
		Manifesto
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
