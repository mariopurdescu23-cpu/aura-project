<script>
	import { onMount } from "svelte";
	import gsap from "gsap";
	import ScrollTrigger from "gsap/ScrollTrigger";
	import { scrollToSection } from "$lib/scrollTo.js";

	const services = [
		{
			title: "Website de prezentare",
			desc: "Prezență online rapidă și modernă",
			icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
			hoverColor: "#eab308",
			glow: "rgba(234,179,8,0.5)",
		},
		{
			title: "Magazin online",
			desc: "Vânzări online cu gestiune simplă a produselor",
			icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
			hoverColor: "#10b981",
			glow: "rgba(16,185,129,0.5)",
		},
		{
			title: "Aplicații de mobil",
			desc: "iOS și Android, native sau cross-platform",
			icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
			hoverColor: "#ef4444",
			glow: "rgba(239,68,68,0.5)",
		},
		{
			title: "Aplicații web (CRM)",
			desc: "Soluții personalizate pentru gestionarea afacerii",
			icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
			hoverColor: "#2563eb",
			glow: "rgba(37,99,235,0.5)",
		},
		{
			title: "Design UI/UX și Branding",
			desc: "Soluții complete de design",
			icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h10a2 2 0 002-2v-4a2 2 0 00-2-2h-2.5",
			hoverColor: "#ec4899",
			glow: "rgba(236,72,153,0.5)",
		},
	];

	let carouselRef = $state();
	let sectionRef = $state();
	let isAnimating = false;

	function scrollCarousel(direction) {
		if (!carouselRef || isAnimating) return;

		const cardWidth = carouselRef.querySelector(
			".carousel-card",
		)?.offsetWidth;
		const gap = 24;
		const distance = direction * (cardWidth + gap);

		const maxScroll = carouselRef.scrollWidth - carouselRef.clientWidth;
		const target = Math.min(
			Math.max(carouselRef.scrollLeft + distance, 0),
			maxScroll,
		);

		isAnimating = true;

		// Dezactivăm temporar scroll-snap — pe telefon, browserul încearcă
		// să "corecteze" singur poziția la fiecare cadru din cauza
		// snap-mandatory, anulând vizual animația GSAP. O repunem după.
		carouselRef.style.scrollSnapType = "none";

		// Animație de swipe: accelerează rapid, apoi decelerează cu putere —
		// senzație de "aruncare" a cardului, nu doar scroll static.
		gsap.to(carouselRef, {
			scrollLeft: target,
			duration: 0.65,
			ease: "power3.out",
			onComplete: () => {
				isAnimating = false;
				carouselRef.style.scrollSnapType = "";
			},
		});
	}

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const cards = carouselRef.querySelectorAll(".carousel-card");

		gsap.fromTo(
			cards,
			{ y: 60, autoAlpha: 0 },
			{
				y: 0,
				autoAlpha: 1,
				duration: 1,
				stagger: 0.1,
				ease: "expo.out",
				scrollTrigger: {
					trigger: sectionRef,
					start: "top 80%",
				},
			},
		);
	});
</script>

<section
	bind:this={sectionRef}
	id="services"
	class="w-full bg-[#050505] text-white py-32 md:py-48 border-t border-white/5 relative z-10 overflow-hidden"
>
	<!-- Huge background glow for volume -->
	<div
		class="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#3B82F6] opacity-[0.02] blur-[200px] rounded-full pointer-events-none"
	></div>

	<div class="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col items-center">
		<span
			class="text-xs font-mono text-white/30 uppercase tracking-widest mb-6 text-center tracking-[0.3em]"
			>Ce Facem</span
		>
		<h3
			class="text-3xl md:text-5xl font-serif text-center mb-16 text-white"
		>
			Website-uri, magazine online,<br class="hidden md:block" /> aplicații
			și design
		</h3>
	</div>

	<div class="w-full px-6 md:px-12">
		<div class="relative w-full">
			<div
				bind:this={carouselRef}
				class="flex lg:grid lg:grid-cols-5 gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{#each services as service}
					<a
						href="#contact"
						onclick={(e) => scrollToSection(e, "#contact")}
						class="carousel-card group shrink-0 lg:shrink snap-start w-[75vw] sm:w-[45vw] lg:w-full h-[420px] md:h-[500px] rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-colors duration-500 relative flex flex-col justify-end p-6 md:p-8"
					>
						<svg
							class="relative z-10 w-12 h-12 md:w-14 md:h-14 mb-4 text-white/40 transition-all duration-300"
							style="--hover-color: {service.hoverColor}; --hover-glow: {service.glow};"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d={service.icon}
							/>
						</svg>

						<h4
							class="relative z-10 text-xl md:text-2xl font-sans font-medium text-white mb-2"
						>
							{service.title}
						</h4>
						<p
							class="relative z-10 text-sm md:text-base text-white/40 font-sans leading-relaxed mb-4"
						>
							{service.desc}
						</p>
						<span
							class="relative z-10 inline-flex items-center gap-2 text-sm font-sans text-white/60 group-hover:text-white group-hover:gap-3 transition-all duration-300"
						>
							Află mai multe
							<svg
								class="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 8l4 4m0 0l-4 4m4-4H3"
								/>
							</svg>
						</span>
					</a>
				{/each}
			</div>

			<!-- Nav arrows — doar pe mobil/tabletă, unde nu intră toate cardurile în ecran -->
			<div class="flex lg:hidden justify-center gap-3 mt-8">
				<button
					onclick={() => scrollCarousel(-1)}
					aria-label="Anterior"
					class="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 active:scale-90 transition-all duration-300 cursor-pointer"
				>
					<svg
						class="w-5 h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
				<button
					onclick={() => scrollCarousel(1)}
					aria-label="Următorul"
					class="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 active:scale-90 transition-all duration-300 cursor-pointer"
				>
					<svg
						class="w-5 h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
</section>

<style>
	.carousel-card:hover svg,
	.carousel-card:active svg {
		color: var(--hover-color);
		filter: drop-shadow(0 0 8px var(--hover-glow));
	}

	/* Pe touch, culoarea trebuie să apară aproape instant la atingere,
	   nu abia după 300ms ca la hover pe desktop. */
	.carousel-card:active svg {
		transition-duration: 0.08s;
	}
</style>