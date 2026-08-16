<script>
	import { onMount } from "svelte";
	import gsap from "gsap";
	import CircleCheck from "@lucide/svelte/icons/circle-check";
	import { t } from "$lib/i18n/index.js";
	import { runWhileVisible, prefersReducedMotion } from "$lib/motion.js";

	let feedbacks = $derived($t.testimonials.feedbacks);

	let currentIndex = $state(0);
	let sectionRef = $state();
	let cardRef = $state();
	let isAnimating = false;
	let timer;

	function nextCard() {
		if (isAnimating) return;
		goToCard((currentIndex + 1) % feedbacks.length);
	}
	function prevCard() {
		if (isAnimating) return;
		goToCard((currentIndex - 1 + feedbacks.length) % feedbacks.length);
	}

	function goToCard(index) {
		if (index === currentIndex || isAnimating) return;
		isAnimating = true;
		if (timer) clearInterval(timer);

		gsap.to(cardRef, {
			autoAlpha: 0,
			y: 10,
			scale: 0.98,
			duration: 0.4,
			ease: "power2.inOut",
			onComplete: () => {
				currentIndex = index;
				gsap.fromTo(
					cardRef,
					{ autoAlpha: 0, y: -10, scale: 0.98 },
					{
						autoAlpha: 1,
						y: 0,
						scale: 1,
						duration: 0.6,
						ease: "power2.out",
						onComplete: () => {
							isAnimating = false;
							timer = setInterval(nextCard, 6000);
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
		dx < 0 ? nextCard() : prevCard();
	}

	onMount(() => {
		if (prefersReducedMotion()) return;

		// Only ticks while the section is actually on screen, same as the
		// carousel this replaced.
		return runWhileVisible(
			sectionRef,
			() => {
				if (!timer && feedbacks.length > 1) timer = setInterval(nextCard, 6000);
			},
			() => {
				if (timer) clearInterval(timer);
				timer = null;
			},
		);
	});
</script>

<section
	bind:this={sectionRef}
	id="testimonials"
	class="w-full bg-[#EDE9FE] text-black py-24 md:py-40 relative overflow-hidden"
>
	<div class="max-w-2xl mx-auto px-6 md:px-12">
		<div class="mb-14 md:mb-16 text-center">
			<span class="text-xs font-mono text-black/40 uppercase tracking-widest mb-6 block"
				>{$t.testimonials.label}</span
			>
			<h2 class="font-display text-4xl md:text-6xl leading-[1.05]">
				{$t.testimonials.title1} <span class="font-serif-italic text-[#5B21F5]">{$t.testimonials.title2}</span>
			</h2>
		</div>

		<div
			class="touch-pan-y"
			role="group"
			aria-label="Client testimonials"
			ontouchstart={handleTouchStart}
			ontouchend={handleTouchEnd}
		>
			<div
				bind:this={cardRef}
				class="bg-white rounded-[24px] md:rounded-[28px] border border-black/8 shadow-[0_20px_60px_rgba(10,10,10,0.06)] p-8 md:p-12"
			>
				<span class="font-display text-6xl leading-none text-[#5B21F5]/20 mb-4 block select-none">"</span>
				<p class="font-display text-xl md:text-2xl leading-[1.4] tracking-tight mb-8 min-h-[130px] md:min-h-[110px]">
					{feedbacks[currentIndex].text}
				</p>

				<!-- Named clients (a real, delivered project behind them) get an
				     initials badge; unattributed feedback would stay text-only,
				     though this carousel currently only holds named ones. -->
				<div class="flex items-center gap-3 pt-6 border-t border-black/8">
					{#if feedbacks[currentIndex].initials}
						<div
							class="w-11 h-11 shrink-0 rounded-full bg-[#5B21F5]/10 text-[#5B21F5] flex items-center justify-center font-display text-sm"
						>
							{feedbacks[currentIndex].initials}
						</div>
					{/if}
					<div class="flex flex-col gap-0.5 min-w-0">
						{#if feedbacks[currentIndex].name}
							<span class="text-sm font-medium text-black flex items-center gap-1.5">
								{feedbacks[currentIndex].name}
								<CircleCheck class="w-3.5 h-3.5 text-[#5B21F5] shrink-0" aria-hidden="true" />
							</span>
						{/if}
						<span class="text-xs font-mono text-black/40 uppercase tracking-widest"
							>{feedbacks[currentIndex].role}</span
						>
					</div>
				</div>
			</div>

			{#if feedbacks.length > 1}
				<div class="flex justify-center gap-4 mt-10">
					{#each feedbacks as _, i}
						<button
							class="w-2 h-2 rounded-full transition-all duration-500 cursor-pointer {currentIndex === i
								? 'bg-[#5B21F5] scale-125'
								: 'bg-black/15 hover:bg-black/40'}"
							aria-label="Go to testimonial {i + 1}"
							onclick={() => goToCard(i)}
						></button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</section>
