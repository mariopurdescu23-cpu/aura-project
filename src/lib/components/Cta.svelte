<script>
	import { onMount } from "svelte";
	import gsap from "gsap";

	const CONTACT_EMAIL = "contact@weberescu.ro";
	const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`;

	let isDesktop = $state(false);
	let btnRef = $state();
	let glowRef = $state();
	let sectionRef = $state();

	onMount(() => {
		isDesktop = !("ontouchstart" in window || navigator.maxTouchPoints > 0);

		gsap.to(glowRef, {
			x: "+=60",
			y: "-=40",
			scale: 1.15,
			duration: 8,
			ease: "sine.inOut",
			yoyo: true,
			repeat: -1,
		});

		if (!isDesktop || !btnRef) return;

		const handleMove = (e) => {
			const rect = btnRef.getBoundingClientRect();
			const relX = e.clientX - (rect.left + rect.width / 2);
			const relY = e.clientY - (rect.top + rect.height / 2);
			gsap.to(btnRef, { x: relX * 0.3, y: relY * 0.3, duration: 0.4, ease: "power3.out" });
		};
		const handleLeave = () => {
			gsap.to(btnRef, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
		};

		btnRef.addEventListener("mousemove", handleMove);
		btnRef.addEventListener("mouseleave", handleLeave);

		return () => {
			btnRef?.removeEventListener("mousemove", handleMove);
			btnRef?.removeEventListener("mouseleave", handleLeave);
		};
	});
</script>

<section
	bind:this={sectionRef}
	id="contact"
	class="w-full bg-[#0A0A0A] text-white min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-32"
>
	<div
		bind:this={glowRef}
		class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full opacity-25 blur-[140px]"
		style="background: radial-gradient(circle, #7C3AED 0%, #5B21F5 55%, transparent 75%);"
	></div>

	<div class="relative z-10 flex flex-col items-center text-center px-6">
		<span class="text-xs font-mono text-white/40 uppercase tracking-widest mb-10">Start a project</span>

		<h2 class="font-display font-medium leading-[0.9] tracking-tight text-[13vw] md:text-[7vw]">
			LET'S MAKE<br />
			SOMETHING<br />
			<span class="font-serif-italic text-[#a78bfa]">unforgettable.</span>
		</h2>

		<a
			bind:this={btnRef}
			href={isDesktop ? GMAIL_COMPOSE_URL : `mailto:${CONTACT_EMAIL}`}
			target={isDesktop ? "_blank" : undefined}
			rel={isDesktop ? "noopener noreferrer" : undefined}
			data-cursor-label="Let's talk"
			class="magnetic-btn mt-16 inline-flex items-center gap-3 px-10 py-6 rounded-full bg-white text-black font-sans font-medium text-lg hover:bg-[#5B21F5] hover:text-white transition-colors duration-500 cursor-pointer will-change-transform"
		>
			Start a project
			<span class="text-2xl">→</span>
		</a>

		<p class="mt-10 text-white/40 font-sans text-sm">
			Or write to <a href={`mailto:${CONTACT_EMAIL}`} class="text-white/70 hover:text-white underline underline-offset-4">{CONTACT_EMAIL}</a>
		</p>
	</div>
</section>
