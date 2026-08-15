<script>
	import { onMount } from "svelte";
	import gsap from "gsap";
	import { scrollToSection } from "$lib/scrollTo.js";
	import { t } from "$lib/i18n/index.js";

	let lines = $state([]);
	let metaTop = $state();
	let descRef = $state();
	let ctaContainer = $state();
	let scrollCue = $state();
	let orbRef = $state();
	let heroRef = $state();

	onMount(() => {
		const tl = gsap.timeline({ delay: 0.15 });

		gsap.set(orbRef, { autoAlpha: 0, scale: 0.7 });
		gsap.set(lines, { yPercent: 120, rotateZ: 1.5 });
		gsap.set([metaTop, descRef, ctaContainer, scrollCue], { y: 16, autoAlpha: 0 });

		tl.to(orbRef, { autoAlpha: 1, scale: 1, duration: 1.8, ease: "power3.out" })
			.to(metaTop, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out" }, "-=1.4")
			.to(
				lines,
				{ yPercent: 0, rotateZ: 0, duration: 1.3, stagger: 0.1, ease: "expo.out" },
				"-=1.2",
			)
			.to(descRef, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, "-=0.7")
			.to(ctaContainer, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, "-=0.7")
			.to(scrollCue, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, "-=0.6");

		// Slow autonomous drift so the orb feels alive even without the mouse
		gsap.to(orbRef, {
			x: "+=40",
			y: "-=30",
			rotate: 8,
			duration: 9,
			ease: "sine.inOut",
			yoyo: true,
			repeat: -1,
		});

		const quickX = gsap.quickTo(orbRef, "x", { duration: 1.1, ease: "power3.out" });
		const quickY = gsap.quickTo(orbRef, "y", { duration: 1.1, ease: "power3.out" });
		const quickScale = gsap.quickTo(orbRef, "scale", { duration: 0.8, ease: "power2.out" });

		const handleMouseMove = (e) => {
			if (!heroRef) return;
			const rect = heroRef.getBoundingClientRect();
			const relX = (e.clientX - rect.left) / rect.width - 0.5;
			const relY = (e.clientY - rect.top) / rect.height - 0.5;
			quickX(relX * 120);
			quickY(relY * 100);
			quickScale(1 + Math.abs(relX) * 0.08);

			gsap.to(lines, {
				x: relX * 14,
				y: relY * 10,
				duration: 1.2,
				ease: "power2.out",
				stagger: 0.01,
			});
		};

		if (window.innerWidth > 768) {
			window.addEventListener("mousemove", handleMouseMove);
		}

		return () => window.removeEventListener("mousemove", handleMouseMove);
	});
</script>

<section
	bind:this={heroRef}
	id="hero"
	class="w-full min-h-screen flex flex-col justify-between relative overflow-hidden bg-white pt-32 md:pt-36 pb-10 px-6 md:px-12"
>
	<!-- Signature purple visual element -->
	<div
		bind:this={orbRef}
		class="pointer-events-none absolute top-[8%] right-[2%] md:right-[10%] w-[280px] h-[280px] md:w-[480px] md:h-[480px] rounded-full will-change-transform z-0"
		style="background: radial-gradient(circle at 35% 30%, #b39ffb 0%, #7C3AED 35%, #5B21F5 62%, rgba(91,33,245,0) 78%); filter: blur(6px);"
	></div>
	<div
		class="pointer-events-none absolute top-[8%] right-[2%] md:right-[10%] w-[280px] h-[280px] md:w-[480px] md:h-[480px] rounded-full opacity-40 blur-[90px] z-0"
		style="background: #5B21F5;"
	></div>

	<!-- Top meta row -->
	<div
		bind:this={metaTop}
		class="relative z-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-mono text-[11px] md:text-xs uppercase tracking-widest text-black/40"
	>
		<span>{$t.hero.metaLeft}</span>
		<span>{$t.hero.metaRight}</span>
	</div>

	<!-- Headline -->
	<div class="relative z-10 w-full flex-1 flex flex-col justify-center py-10 md:py-6">
		<h1
			class="font-display font-medium leading-[0.86] tracking-tight text-black text-[16vw] md:text-[8.4vw] max-w-[95vw]"
		>
			<div class="overflow-hidden pb-2">
				<div bind:this={lines[0]} class="will-change-transform">{$t.hero.line1}</div>
			</div>
			<div class="overflow-hidden pb-2">
				<div bind:this={lines[1]} class="will-change-transform">{$t.hero.line2}</div>
			</div>
			<div class="overflow-hidden pb-2">
				<div bind:this={lines[2]} class="will-change-transform font-serif-italic text-[#5B21F5]">
					{$t.hero.line3}
				</div>
			</div>
		</h1>
	</div>

	<!-- Bottom row: description + CTAs + scroll cue -->
	<div class="relative z-10 w-full flex flex-col md:flex-row justify-between items-end gap-10">
		<div class="max-w-md">
			<p
				bind:this={descRef}
				class="text-base md:text-lg text-black/55 font-sans font-light leading-relaxed"
			>
				{$t.hero.desc}
			</p>

			<div bind:this={ctaContainer} class="mt-8 flex flex-wrap gap-4">
				<a
					href="#contact"
					onclick={(e) => scrollToSection(e, "#contact")}
					data-cursor-label={$t.cta.label}
					class="magnetic-btn px-8 py-4 bg-[#0A0A0A] text-white rounded-full font-sans font-medium hover:bg-[#5B21F5] transition-colors duration-500 cursor-pointer text-center text-sm"
				>
					{$t.hero.ctaPrimary}
				</a>
				<a
					href="#work"
					onclick={(e) => scrollToSection(e, "#work")}
					data-cursor-label={$t.hero.ctaSecondary}
					class="px-8 py-4 bg-transparent text-black border border-black/15 rounded-full font-sans font-medium hover:border-black/40 transition-all duration-500 cursor-pointer text-center text-sm"
				>
					{$t.hero.ctaSecondary}
				</a>
			</div>
		</div>

		<div bind:this={scrollCue} class="hidden sm:flex flex-col items-center gap-3 text-black/30">
			<span class="text-[10px] font-mono uppercase tracking-widest [writing-mode:vertical-lr]">{$t.hero.scroll}</span>
			<span class="w-px h-16 bg-black/15 relative overflow-hidden">
				<span class="absolute top-0 left-0 w-full h-4 bg-[#5B21F5] scroll-line"></span>
			</span>
		</div>
	</div>
</section>

<style>
	.scroll-line {
		animation: scrollLine 2s ease-in-out infinite;
	}
	@keyframes scrollLine {
		0% {
			transform: translateY(-100%);
		}
		100% {
			transform: translateY(400%);
		}
	}
</style>
