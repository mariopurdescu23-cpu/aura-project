<script>
	import { onMount } from "svelte";
	import Logo from "./logo.svelte";
	import { scrollToSection } from "$lib/scrollTo.js";

	const CONTACT_EMAIL = "contact@weberescu.ro";
	const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`;

	// Pe desktop deschidem Gmail direct (cu destinatarul precompletat),
	// ca omul să scrie doar mesajul. Pe telefon lăsăm comportamentul
	// normal mailto:, care deschide aplicația de mail deja instalată.
	let isDesktop = $state(false);

	onMount(() => {
		isDesktop = !("ontouchstart" in window || navigator.maxTouchPoints > 0);
	});
</script>

<footer
	id="contact"
	class="w-full bg-[#050505] text-white pt-32 pb-12 relative overflow-hidden border-t border-white/10 border-b-8 border-b-white/5"
>
	<!-- CTA Section -->
	<div
		class="px-6 md:px-24 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-32 gap-12"
	>
		<h2
			class="text-[12vw] md:text-[7vw] font-serif leading-[0.85] tracking-tighter mix-blend-difference z-10 w-full md:w-2/3"
		>
			Ai un proiect<br />
			<span class="italic text-white/40">în minte?</span>
		</h2>
		<div class="w-full md:w-1/3 flex md:justify-end z-10">
			<a
				href={isDesktop ? GMAIL_COMPOSE_URL : `mailto:${CONTACT_EMAIL}`}
				target={isDesktop ? "_blank" : undefined}
				rel={isDesktop ? "noopener noreferrer" : undefined}
				class="group relative flex items-center justify-center w-40 h-40 md:w-48 md:h-48 rounded-full bg-white text-black hover:scale-105 active:scale-105 transition-transform duration-500 cursor-pointer"
			>
				<span
					class="absolute inset-0 bg-[#3B82F6] rounded-full transform scale-0 group-hover:scale-100 group-active:scale-100 transition-transform duration-500 ease-out z-0"
				></span>
				<span
					class="font-sans font-medium text-lg relative z-10 group-hover:text-white group-active:text-white transition-colors duration-500"
					>Hai să vorbim</span
				>
			</a>
		</div>
	</div>

	<!-- Multi-Column Links Section -->
	<div
		class="px-6 md:px-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 mb-24 z-10 relative"
	>
		<div class="col-span-1 md:col-span-1 flex flex-col gap-6">
			<div class="opacity-80"><Logo /></div>
			<p class="text-white/40 font-sans text-sm leading-relaxed max-w-xs">
				O agenție creativă de Software & Web Design cu sute de clienți mulțumiți!
			</p>
		</div>

		<div class="col-span-1 flex flex-col gap-4">
			<h4
				class="font-mono text-xs uppercase tracking-widest text-[#3B82F6] mb-2"
			>
				Navigare
			</h4>
			<a
				href="#agency"
				onclick={(e) => scrollToSection(e, "#agency")}
				class="text-white/60 hover:text-white font-sans text-sm transition-colors"
				>Acasă</a
			>
			<a
				href="#services"
				onclick={(e) => scrollToSection(e, "#services")}
				class="text-white/60 hover:text-white font-sans text-sm transition-colors"
				>Servicii</a
			>
			<a
				href="#work"
				onclick={(e) => scrollToSection(e, "#work")}
				class="text-white/60 hover:text-white font-sans text-sm transition-colors"
				>Lucrări Selectate</a
			>
			<a
				href="#faq"
				onclick={(e) => scrollToSection(e, "#faq")}
				class="text-white/60 hover:text-white font-sans text-sm transition-colors"
				>Întrebări Frecvente</a
			>
		</div>

		<div class="col-span-1 flex flex-col gap-4">
			<h4
				class="font-mono text-xs uppercase tracking-widest text-[#3B82F6] mb-2"
			>
				Rețele Sociale
			</h4>
			<a
				href="https://instagram.com/weberescu"
				class="text-white/60 hover:text-white font-sans text-sm transition-colors"
				>Instagram</a
			>
			<a
				href="https://tiktok.com/@weberescu"
				class="text-white/60 hover:text-white font-sans text-sm transition-colors"
				>TikTok</a
			>
			<a
				href="https://www.facebook.com/profile.php?id=61592492747692"
				class="text-white/60 hover:text-white font-sans text-sm transition-colors"
				>Facebook</a
			>
		</div>

		<div class="col-span-1 flex flex-col gap-4">
			<h4
				class="font-mono text-xs uppercase tracking-widest text-[#3B82F6] mb-2"
			>
				Newsletter
			</h4>
			<p class="text-white/40 font-sans text-sm">
				Abonează-te pentru insight-uri despre WebGL, Svelte și inginerie de design.
			</p>
			<div class="mt-2 flex w-full relative">
				<input
					type="email"
					placeholder="Introdu adresa de email"
					class="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm text-white focus:outline-none focus:border-white/40 transition-colors"
				/>
				<button
					class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#3B82F6] hover:text-white transition-colors"
				>
					&rarr;
				</button>
			</div>
		</div>
	</div>

	<!-- Copyright & Author Bar -->
	<div
		class="px-6 md:px-24 max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 text-xs font-mono text-base tracking-wider relative z-10"
	>
		<p class="text-white/30">&copy; 2026 Weberescu.</p>

		<div class="flex flex-col md:flex-row items-center gap-4 md:gap-8">
			<span class="text-white/50 text-sm font-sans font-light">
				Dezvoltat de <a
					href="https://weberescu.ro"
					target="_blank"
					rel="noopener noreferrer"
					class="text-[#3B82F6] font-medium hover:text-white transition-colors duration-500 hover:underline underline-offset-4"
					>Weberescu</a
				>
			</span>
			<div class="flex gap-6 text-white/30 hidden md:flex">
				<a href="#privacy" class="hover:text-white/60 transition-colors"
					>Politica de Confidențialitate</a
				>
				<a href="#terms" class="hover:text-white/60 transition-colors"
					>Termeni și Condiții</a
				>
			</div>
		</div>
	</div>

	<!-- Giant background glow -->
	<div
		class="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen h-[400px] bg-[#3B82F6] opacity-5 blur-[200px] pointer-events-none"
	></div>
</footer>
