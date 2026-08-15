<script>
	import Logo from "./logo.svelte";
	import { scrollToSection } from "$lib/scrollTo.js";
	import { t } from "$lib/i18n/index.js";
</script>

<footer class="w-full bg-[#0A0A0A] text-white pt-16 md:pt-20 pb-10 relative overflow-hidden border-t border-white/10">
	<div class="px-6 md:px-24 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-4 mb-16 md:mb-20 relative z-10">
		<div class="col-span-2 md:col-span-1 flex flex-col gap-6">
			<div class="opacity-90"><Logo dark={true} /></div>
			<p class="text-white/40 font-sans text-sm leading-relaxed max-w-xs">
				{$t.footer.desc}
			</p>
			<div class="flex items-center gap-2 text-xs font-mono text-white/40 uppercase tracking-widest">
				<span class="relative flex w-2 h-2 shrink-0">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C3AED] opacity-75"></span>
					<span class="relative inline-flex rounded-full h-2 w-2 bg-[#a78bfa]"></span>
				</span>
				{$t.footer.booking}
			</div>
		</div>

		<div class="col-span-1 flex flex-col gap-3 md:gap-4">
			<h4 class="font-mono text-xs uppercase tracking-widest text-[#a78bfa] mb-2">{$t.footer.navigate}</h4>
			<a href="#work" onclick={(e) => scrollToSection(e, "#work")} class="text-white/60 hover:text-white font-sans text-sm transition-colors">{$t.nav.work}</a>
			<a href="#services" onclick={(e) => scrollToSection(e, "#services")} class="text-white/60 hover:text-white font-sans text-sm transition-colors">{$t.nav.services}</a>
			<a href="#about" onclick={(e) => scrollToSection(e, "#about")} class="text-white/60 hover:text-white font-sans text-sm transition-colors">{$t.nav.about}</a>
			<a href="#contact" onclick={(e) => scrollToSection(e, "#contact")} class="text-white/60 hover:text-white font-sans text-sm transition-colors">{$t.nav.contact}</a>
		</div>

		<div class="col-span-1 flex flex-col gap-3 md:gap-4">
			<h4 class="font-mono text-xs uppercase tracking-widest text-[#a78bfa] mb-2">{$t.footer.studio}</h4>
			<span class="text-white/60 font-sans text-sm">{$t.footer.basedIn}</span>
			<span class="text-white/60 font-sans text-sm">{$t.footer.workingGlobally}</span>
			<a href="mailto:contact@weberescu.ro" class="text-white/60 hover:text-white font-sans text-sm transition-colors break-all">contact@weberescu.ro</a>
		</div>

		<div class="col-span-1 flex flex-col gap-3 md:gap-4">
			<h4 class="font-mono text-xs uppercase tracking-widest text-[#a78bfa] mb-2">{$t.footer.social}</h4>
			<a href="https://instagram.com/weberescu" class="text-white/60 hover:text-white font-sans text-sm transition-colors">Instagram</a>
			<a href="https://tiktok.com/@weberescu" class="text-white/60 hover:text-white font-sans text-sm transition-colors">TikTok</a>
			<a href="https://www.facebook.com/profile.php?id=61592492747692" class="text-white/60 hover:text-white font-sans text-sm transition-colors">Facebook</a>
		</div>
	</div>

	<div
		class="px-6 md:px-24 max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs font-mono text-white/30 tracking-wider relative z-10 text-center md:text-left"
	>
		<p>&copy; 2026 Weberescu. {$t.footer.rights}</p>
		<div class="hidden md:flex gap-2 text-white/20">
			<span>{$t.footer.credit}</span>
		</div>
	</div>

	<!-- Small animated purple element -->
	<div
		class="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen h-[300px] bg-[#5B21F5] opacity-[0.06] blur-[180px] pointer-events-none"
	></div>
</footer>
