<script>
	import { onMount } from "svelte";
	import gsap from "gsap";
	import ScrollToPlugin from "gsap/ScrollToPlugin";
	import Logo from "./logo.svelte";
	import Menu from "@lucide/svelte/icons/menu";
	import X from "@lucide/svelte/icons/x";

	let headerRef = $state();
	let navItemsRef = $state([]);
	let iconsRef = $state();
	let logoRef = $state();
	let mobileMenuRef = $state();
	let mobileLinksRef = $state([]);
	let isMenuOpen = $state(false);

	let lastScroll = 0;
	let hidden = $state(false);
	let scrolled = $state(false);

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

	function scrollTo(evt, id, offsetY = 40) {
		evt.preventDefault();
		if (isMenuOpen) toggleMenu();
		gsap.to(window, {
			duration: 1.5,
			scrollTo: { y: id, offsetY },
			ease: "expo.inOut",
		});
	}

	onMount(() => {
		gsap.registerPlugin(ScrollToPlugin);
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
					maxWidth: "880px",
					opacity: 1,
					duration: 1.2,
					ease: "expo.inOut",
				}).to(
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
			scrolled = current > 40;
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
				<a href="#work" onclick={(e) => scrollTo(e, "#work")} class="hover:text-black transition-colors">Work</a>
			</li>
			<li bind:this={navItemsRef[1]}>
				<a href="#services" onclick={(e) => scrollTo(e, "#services")} class="hover:text-black transition-colors">Services</a>
			</li>
			<li bind:this={navItemsRef[2]}>
				<a href="#about" onclick={(e) => scrollTo(e, "#about")} class="hover:text-black transition-colors">About</a>
			</li>
			<li bind:this={navItemsRef[3]}>
				<a href="#contact" onclick={(e) => scrollTo(e, "#contact")} class="hover:text-black transition-colors">Contact</a>
			</li>
		</ul>
	</div>

	<!-- Right Controls -->
	<div bind:this={iconsRef} class="flex space-x-1 sm:space-x-3 items-center z-50">
		<a
			href="#contact"
			onclick={(e) => scrollTo(e, "#contact")}
			data-cursor-label="Let's talk"
			class="hidden md:flex items-center justify-center text-sm font-medium bg-[#5B21F5] text-white hover:bg-[#0A0A0A] transition-colors duration-300 px-6 py-2 rounded-full"
			>Start a project</a
		>
		<button
			onclick={toggleMenu}
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
	class="fixed inset-0 z-40 bg-white flex flex-col justify-center invisible opacity-0 px-10 overflow-hidden"
>
	<div
		class="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#5B21F5] opacity-[0.08] blur-[100px] rounded-full pointer-events-none"
	></div>

	<ul class="flex flex-col space-y-8 text-left relative z-10">
		<li class="overflow-hidden">
			<a
				bind:this={mobileLinksRef[0]}
				href="#work"
				onclick={(e) => scrollTo(e, "#work")}
				class="block text-5xl font-display font-medium text-black/80 hover:text-black transition-colors will-change-transform"
				>Work</a
			>
		</li>
		<li class="overflow-hidden">
			<a
				bind:this={mobileLinksRef[1]}
				href="#services"
				onclick={(e) => scrollTo(e, "#services", -170)}
				class="block text-5xl font-display font-medium text-black/80 hover:text-black transition-colors will-change-transform"
				>Services</a
			>
		</li>
		<li class="overflow-hidden">
			<a
				bind:this={mobileLinksRef[2]}
				href="#about"
				onclick={(e) => scrollTo(e, "#about")}
				class="block text-5xl font-display font-medium text-black/80 hover:text-black transition-colors will-change-transform"
				>About</a
			>
		</li>
		<li class="overflow-hidden">
			<a
				bind:this={mobileLinksRef[3]}
				href="#contact"
				onclick={(e) => scrollTo(e, "#contact")}
				class="block text-5xl font-display font-medium text-black/80 hover:text-black transition-colors will-change-transform"
				>Contact</a
			>
		</li>
		<li class="overflow-hidden mt-4 pt-8 border-t border-black/10">
			<a
				bind:this={mobileLinksRef[4]}
				href="#contact"
				onclick={(e) => scrollTo(e, "#contact")}
				class="inline-block text-xl font-sans text-[#5B21F5] font-medium hover:text-black transition-colors will-change-transform"
				>Start a project &rarr;</a
			>
		</li>
	</ul>

	<div
		class="absolute bottom-10 left-10 flex gap-6 text-xs font-mono text-black/40 uppercase tracking-widest relative z-10"
	>
		<a href="https://instagram.com/weberescu">Instagram</a>
		<a href="https://www.facebook.com/profile.php?id=61592492747692">Facebook</a>
	</div>
</div>

<style>
	.header {
		border-radius: 100px;
	}
</style>
