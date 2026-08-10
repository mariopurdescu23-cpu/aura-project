<script>
	import { onMount } from "svelte";
	import gsap from "gsap";

	let rowRef = $state();

	onMount(() => {
		// Continuous smooth linear scroll for modern aesthetic
		// To make it seamless, we translate exactly half of the duplicated content width
		gsap.to(rowRef, {
			xPercent: -50,
			repeat: -1,
			duration: 25,
			ease: "none",
		});
	});

	const brands = [
		{
			name: "Cabane A-Frame Svinița",
			mark: "M12 2L2 22h20L12 2zm0 5l6 12H6l6-12z",
		},
		{
			name: "Seeker Romania",
			mark: "M11 4a7 7 0 100 14 7 7 0 000-14zm10 18l-5.35-5.35",
		},
		{
			name: "Lumina",
			mark: "M12 2v3m0 14v3m10-10h-3M5 12H2m15.5-7.5l-2.1 2.1M6.6 17.4l-2.1 2.1m0-15l2.1 2.1m10.8 10.8l2.1 2.1M12 8a4 4 0 100 8 4 4 0 000-8z",
		},
		{
			name: "Ozone",
			mark: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 5a5 5 0 110 10 5 5 0 010-10z",
		},
		{
			name: "Nexal",
			mark: "M12 2l8.66 5v10L12 22l-8.66-5V7L12 2zm0 5v10M3.34 7L12 12l8.66-5",
		},
	];
	// Duplicăm lista pentru bucla infinită a marquee-ului
	const brandsLoop = [...brands, ...brands];
</script>

<section
	class="w-full bg-[#050505] py-16 md:py-24 overflow-hidden flex flex-col items-center justify-center border-t border-white/5 relative"
>
	<!-- Extreme fading edges for soft integration -->
	<div
		class="absolute inset-y-0 left-0 w-32 md:w-80 bg-linear-to-r from-[#050505] to-transparent z-10 pointer-events-none"
	></div>
	<div
		class="absolute inset-y-0 right-0 w-32 md:w-80 bg-linear-to-l from-[#050505] to-transparent z-10 pointer-events-none"
	></div>

	<p
		class="text-xs font-mono text-white/30 uppercase tracking-widest mb-10 text-center relative z-20"
	>
		Colaborăm cu echipe vizionare
	</p>

	<!-- Endless Marquee Wrapper -->
	<div class="flex overflow-hidden w-full relative z-0">
		<div
			bind:this={rowRef}
			class="flex whitespace-nowrap will-change-transform w-fit"
		>
			<div class="flex gap-16 md:gap-32 px-8 md:px-16 items-center">
				{#each brandsLoop as brand}
					<div
						class="flex items-center gap-3 md:gap-4 text-2xl md:text-4xl font-serif text-white/30 hover:text-white transition-colors duration-700 cursor-pointer select-none"
					>
						<svg
							class="w-6 h-6 md:w-8 md:h-8 shrink-0"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d={brand.mark}
							/>
						</svg>
						{brand.name}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>