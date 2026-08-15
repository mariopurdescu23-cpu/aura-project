<script>
	import { onMount } from "svelte";
	import gsap from "gsap";
	import { t } from "$lib/i18n/index.js";

	let feedbacks = $derived($t.testimonials.feedbacks);

	let currentIndex = $state(0);
	let quoteRef = $state();
	let roleRef = $state();
	let isAnimating = false;
	let timer;

	function nextQuote() {
		if (isAnimating) return;
		goToQuote((currentIndex + 1) % feedbacks.length);
	}
	function prevQuote() {
		if (isAnimating) return;
		goToQuote((currentIndex - 1 + feedbacks.length) % feedbacks.length);
	}

	function goToQuote(index) {
		if (index === currentIndex || isAnimating) return;
		isAnimating = true;
		if (timer) clearInterval(timer);

		gsap.to([quoteRef, roleRef], {
			autoAlpha: 0,
			y: 10,
			duration: 0.5,
			ease: "power2.inOut",
			onComplete: () => {
				currentIndex = index;
				gsap.fromTo(
					[quoteRef, roleRef],
					{ autoAlpha: 0, y: -10 },
					{
						autoAlpha: 1,
						y: 0,
						duration: 0.8,
						stagger: 0.15,
						ease: "power2.out",
						onComplete: () => {
							isAnimating = false;
							timer = setInterval(nextQuote, 6000);
						},
					},
				);
			},
		});
	}

	let touchStartX = 0;
	let touchStartY = 0;
	function handleTouchStart(e) {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
	}
	function handleTouchEnd(e) {
		const dx = e.changedTouches[0].clientX - touchStartX;
		const dy = e.changedTouches[0].clientY - touchStartY;
		if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
		dx < 0 ? nextQuote() : prevQuote();
	}

	onMount(() => {
		timer = setInterval(nextQuote, 6000);
		return () => timer && clearInterval(timer);
	});
</script>

<section
	id="testimonials"
	class="w-full bg-[#EDE9FE] text-black py-32 md:py-48 flex items-center justify-center relative overflow-hidden"
>
	<div
		class="max-w-4xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center touch-pan-y"
		role="group"
		aria-label="Client testimonials"
		ontouchstart={handleTouchStart}
		ontouchend={handleTouchEnd}
	>
		<span class="font-display text-8xl md:text-[10rem] leading-none text-[#5B21F5]/20 mb-4 select-none">"</span>

		<blockquote
			bind:this={quoteRef}
			class="font-display text-2xl md:text-4xl leading-[1.35] tracking-tight mb-12 flex items-center justify-center will-change-transform min-h-[160px] md:min-h-[140px] -mt-16 m-0"
		>
			{feedbacks[currentIndex].text}
		</blockquote>

		<div bind:this={roleRef} class="flex flex-col items-center gap-1 will-change-transform">
			<span class="text-sm font-mono text-black/50 uppercase tracking-widest">{feedbacks[currentIndex].role}</span>
		</div>

		<div class="flex gap-4 mt-14">
			{#each feedbacks as _, i}
				<button
					class="w-2 h-2 rounded-full transition-all duration-500 cursor-pointer {currentIndex === i
						? 'bg-[#5B21F5] scale-125'
						: 'bg-black/15 hover:bg-black/40'}"
					aria-label="Go to slide {i + 1}"
					onclick={() => goToQuote(i)}
				></button>
			{/each}
		</div>
	</div>
</section>
