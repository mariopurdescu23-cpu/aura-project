<script>
	import { onMount } from "svelte";
	import gsap from "gsap";
	import Logo from "./logo.svelte";
	import Menu from "@lucide/svelte/icons/menu";
	import X from "@lucide/svelte/icons/x";
	import ChevronDown from "@lucide/svelte/icons/chevron-down";
	import Check from "@lucide/svelte/icons/check";
	import { fade } from "svelte/transition";
	import { fillPress } from "$lib/actions/fillPress.js";
	import { t, lang, setLang } from "$lib/i18n/index.js";
	import { scrollToSection } from "$lib/scrollTo.js";
	import { prefersReducedMotion } from "$lib/motion.js";

	let headerRef = $state();
	let navItemsRef = $state([]);
	let iconsRef = $state();
	let logoRef = $state();
	let mobileMenuRef = $state();
	let mobileLinksRef = $state([]);
	let isMenuOpen = $state(false);

	let lastScroll = 0;
	let hidden = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
		if (isMenuOpen) {
			const tl = gsap.timeline();
			tl.to(mobileMenuRef, {
				autoAlpha: 1,
				clipPath: "inset(0% 0% 0% 0%)",
				duration: 0.8,
				ease: "power2.inOut",
			}).fromTo(
				mobileLinksRef,
				{ y: 20, autoAlpha: 0 },
				{
					y: 0,
					autoAlpha: 1,
					duration: 0.8,
					stagger: 0.1,
					ease: "power2.out",
				},
				"-=0.4",
			);
		} else {
			gsap.to(mobileMenuRef, {
				autoAlpha: 0,
				clipPath: "inset(0% 100% 0% 0%)",
				duration: 0.6,
				ease: "power2.inOut",
			});
		}
	}

	// Same anchor-navigation helper the rest of the page uses, so there is one
	// implementation instead of two that can drift apart.
	function scrollTo(evt, id, offsetY = 40) {
		if (isMenuOpen) toggleMenu();
		scrollToSection(evt, id, offsetY);
	}

	function pickLang(value) {
		setLang(value);
	}

	onMount(() => {
		// Reduced motion: the header markup starts collapsed (`w-0 opacity-0`)
		// because the intro tween expands it, so it has to be put into its
		// final state explicitly rather than just skipping the animation.
		if (prefersReducedMotion()) {
			gsap.set(headerRef, { width: "100%", maxWidth: "920px", opacity: 1, overflow: "visible" });
			gsap.set(mobileMenuRef, { clipPath: "inset(0% 100% 0% 0%)" });
			return () => {};
		}

		let mm = gsap.matchMedia();

		mm.add(
			{
				isMobile: "(max-width: 767px)",
				isDesktop: "(min-width: 768px)",
			},
			(context) => {
				let { isMobile, isDesktop } = context.conditions;
				const tl = gsap.timeline({ delay: 0.2 });

				gsap.set(headerRef, { width: "0px", opacity: 0, overflow: "hidden" });
				gsap.set(logoRef, { autoAlpha: 0, y: 15, scale: 0.95 });
				gsap.set(iconsRef, { autoAlpha: 0, x: 10 });
				gsap.set(mobileMenuRef, { clipPath: "inset(0% 100% 0% 0%)" });

				if (isDesktop) {
					gsap.set(navItemsRef, { autoAlpha: 0, y: 15 });
				}

				tl.to(headerRef, {
					width: isMobile ? "calc(100% - 2rem)" : "100%",
					maxWidth: "920px",
					opacity: 1,
					duration: 1.2,
					ease: "expo.inOut",
				})
					.set(headerRef, { overflow: "visible" })
					.to(
						logoRef,
						{ autoAlpha: 1, y: 0, scale: 1, duration: 1.2, ease: "expo.out" },
						"-=0.2",
					);

				if (isDesktop) {
					tl.to(
						navItemsRef,
						{ autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" },
						"-=0.5",
					);
				}

				tl.to(
					iconsRef,
					{ autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
					"-=0.5",
				);

				return () => tl.kill();
			},
		);

		const onScroll = () => {
			const current = window.scrollY;
			if (current > lastScroll && current > 200 && !isMenuOpen) {
				hidden = true;
			} else {
				hidden = false;
			}
			lastScroll = current;
		};
		window.addEventListener("scroll", onScroll, { passive: true });

		return () => {
			mm.revert();
			window.removeEventListener("scroll", onScroll);
		};
	});
</script>

<div
	bind:this={headerRef}
	class="header opacity-0 w-0 z-60 fixed top-4 left-1/2 -translate-x-1/2 bg-white/80 border border-black/10 h-[60px] pl-6 pr-2 whitespace-nowrap flex justify-between items-center backdrop-blur-xl shadow-[0_8px_30px_rgba(10,10,10,0.05)] transition-transform duration-500 {hidden
		? '-translate-y-[calc(100%+2rem)]'
		: 'translate-y-0'}"
	style="translate: -50% 0;"
>
	<a
		id="logo"
		href="#hero"
		onclick={(e) => scrollTo(e, "#hero")}
		bind:this={logoRef}
		data-cursor-label="Home"
		class="flex-shrink-0 flex items-center justify-center w-auto cursor-pointer"
	>
		<Logo />
	</a>

	<!-- Desktop Nav -->
	<div id="nav" class="absolute left-1/2 -translate-x-1/2 hidden md:block">
		<ul class="flex space-x-8 text-sm font-medium text-black/60">
			<li bind:this={navItemsRef[0]}>
				<a href="#work" onclick={(e) => scrollTo(e, "#work")} class="hover:text-black transition-colors">{$t.nav.work}</a>
			</li>
			<li bind:this={navItemsRef[1]}>
				<a href="#services" onclick={(e) => scrollTo(e, "#services")} class="hover:text-black transition-colors">{$t.nav.services}</a>
			</li>
			<li bind:this={navItemsRef[2]}>
				<a href="#about" onclick={(e) => scrollTo(e, "#about")} class="hover:text-black transition-colors">{$t.nav.about}</a>
			</li>
			<li bind:this={navItemsRef[3]}>
				<a href="#contact" onclick={(e) => scrollTo(e, "#contact")} class="hover:text-black transition-colors">{$t.nav.contact}</a>
			</li>
		</ul>
	</div>

	<!-- Right Controls -->
	<div bind:this={iconsRef} class="flex space-x-1 sm:space-x-2 items-center z-50">
		<!-- Language selector — desktop only, opens on hover -->
		<div class="hidden md:block relative group/lang h-full">
			<button
				class="flex items-center gap-1 h-full px-3 text-sm font-medium text-black/60 hover:text-black transition-colors cursor-pointer"
			>
				<span>{$t.nav.language}</span>
				<ChevronDown class="w-3.5 h-3.5 rotate-180 transition-transform duration-300 group-hover/lang:rotate-0" />
			</button>

			<div
				class="absolute top-full right-0 pt-3 w-40 opacity-0 invisible translate-y-1 group-hover/lang:opacity-100 group-hover/lang:visible group-hover/lang:translate-y-0 transition-all duration-300"
			>
				<div class="bg-white border border-black/10 rounded-2xl shadow-[0_20px_50px_rgba(10,10,10,0.12)] p-1.5">
					<button
						onclick={() => pickLang("ro")}
						class="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer {$lang === 'ro'
							? 'text-[#5B21F5] font-medium bg-[#5B21F5]/[0.06]'
							: 'text-black/70 hover:bg-black/5'}"
					>
						{$t.nav.langRO}
						{#if $lang === "ro"}<Check class="w-3.5 h-3.5" />{/if}
					</button>
					<button
						onclick={() => pickLang("en")}
						class="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer {$lang === 'en'
							? 'text-[#5B21F5] font-medium bg-[#5B21F5]/[0.06]'
							: 'text-black/70 hover:bg-black/5'}"
					>
						{$t.nav.langEN}
						{#if $lang === "en"}<Check class="w-3.5 h-3.5" />{/if}
					</button>
				</div>
			</div>
		</div>

		<a
			href="#contact"
			onclick={(e) => scrollTo(e, "#contact")}
			data-cursor-label={$t.cta.label}
			class="hidden md:flex items-center justify-center text-sm font-medium bg-[#5B21F5] text-white hover:bg-[#0A0A0A] transition-colors duration-300 px-6 py-2 rounded-full"
			>{$t.nav.cta}</a
		>
		<button
			onclick={toggleMenu}
			aria-label={isMenuOpen ? $t.nav.closeMenu : $t.nav.openMenu}
			aria-expanded={isMenuOpen}
			class="cursor-pointer w-10 h-10 flex justify-center items-center rounded-full text-black/70 hover:text-black hover:bg-black/5 transition-colors md:hidden"
		>
			{#if isMenuOpen}
				<X />
			{:else}
				<Menu />
			{/if}
		</button>
	</div>
</div>

<!-- Mobile full-screen overlay -->
<div
	bind:this={mobileMenuRef}
	class="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl flex flex-col justify-center invisible opacity-0 px-8 sm:px-10 pt-16 overflow-hidden"
>
	<!-- The blurred glow is desktop-only: a 100px CSS blur is expensive to
	     repaint, and combined with the clip-path open/close animation it
	     made the menu visibly laggy on phones. -->
	<div
		class="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#7C3AED] opacity-[0.10] blur-[100px] rounded-full pointer-events-none"
	></div>

	{#key $lang}
		<ul
			in:fade={{ duration: 260, delay: 130 }}
			out:fade={{ duration: 130 }}
			class="flex flex-col space-y-4 sm:space-y-7 text-left relative z-10"
		>
			<li class="overflow-hidden">
				<a
					bind:this={mobileLinksRef[0]}
					href="#work"
					onclick={(e) => scrollTo(e, "#work")}
					use:fillPress
					class="block text-[11vw] sm:text-5xl font-display font-medium text-[#0A0A0A] hover:text-[#5B21F5] transition-colors will-change-transform px-1 -mx-1 rounded-2xl"
					>{$t.nav.work}</a
				>
			</li>
			<li class="overflow-hidden">
				<a
					bind:this={mobileLinksRef[1]}
					href="#services"
					onclick={(e) => scrollTo(e, "#services", -170)}
					use:fillPress
					class="block text-[11vw] sm:text-5xl font-display font-medium text-[#0A0A0A] hover:text-[#5B21F5] transition-colors will-change-transform px-1 -mx-1 rounded-2xl"
					>{$t.nav.services}</a
				>
			</li>
			<li class="overflow-hidden">
				<a
					bind:this={mobileLinksRef[2]}
					href="#about"
					onclick={(e) => scrollTo(e, "#about")}
					use:fillPress
					class="block text-[11vw] sm:text-5xl font-display font-medium text-[#0A0A0A] hover:text-[#5B21F5] transition-colors will-change-transform px-1 -mx-1 rounded-2xl"
					>{$t.nav.about}</a
				>
			</li>
			<li class="overflow-hidden">
				<a
					bind:this={mobileLinksRef[3]}
					href="#contact"
					onclick={(e) => scrollTo(e, "#contact")}
					use:fillPress
					class="block text-[11vw] sm:text-5xl font-display font-medium text-[#0A0A0A] hover:text-[#5B21F5] transition-colors will-change-transform px-1 -mx-1 rounded-2xl"
					>{$t.nav.contact}</a
				>
			</li>
			<li class="overflow-hidden mt-2 pt-6 border-t border-black/10">
				<a
					bind:this={mobileLinksRef[4]}
					href="#contact"
					onclick={(e) => scrollTo(e, "#contact")}
					use:fillPress
					class="inline-block text-lg sm:text-xl font-sans text-[#5B21F5] font-medium hover:text-[#0A0A0A] transition-colors will-change-transform px-3 -mx-3 py-1 rounded-full"
					>{$t.nav.cta} &rarr;</a
				>
			</li>
		</ul>
	{/key}

	<!-- Mobile language toggle — kept outside the {#key} fade above so tapping
	     RO/EN gives instant feedback instead of waiting on a crossfade. -->
	<div class="relative z-10 mt-10 pt-6 border-t border-black/10 flex items-center gap-3">
		<span class="text-xs font-mono text-black/40 uppercase tracking-widest">{$t.nav.language}</span>
		<div class="flex items-center gap-1.5 bg-black/5 rounded-full p-1">
			<button
				onclick={() => pickLang("ro")}
				class="px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 cursor-pointer {$lang === 'ro'
					? 'bg-[#5B21F5] text-white'
					: 'text-black/50'}"
			>
				RO
			</button>
			<button
				onclick={() => pickLang("en")}
				class="px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 cursor-pointer {$lang === 'en'
					? 'bg-[#5B21F5] text-white'
					: 'text-black/50'}"
			>
				EN
			</button>
		</div>
	</div>

	<div
		class="relative z-10 mt-8 flex gap-6 text-xs font-mono text-black/40 uppercase tracking-widest"
	>
		<a href="https://instagram.com/weberescu" class="hover:text-[#5B21F5] transition-colors">Instagram</a>
		<a href="https://www.facebook.com/profile.php?id=61592492747692" class="hover:text-[#5B21F5] transition-colors">Facebook</a>
	</div>
</div>

<style>
	.header {
		border-radius: 100px;
	}
</style>
