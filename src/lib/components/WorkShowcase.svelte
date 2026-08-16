<script>
	import imgCabana from "$lib/assets/work/cabana-svinita.jpg";
	import imgRodica from "$lib/assets/work/rodica-chiriches.jpg";
	import imgSeeker from "$lib/assets/work/seeker.jpg";
	import imgMysticpuff from "$lib/assets/work/mysticpuff.jpg";
	import { fillPress } from "$lib/actions/fillPress.js";
	import { scrollToSection } from "$lib/scrollTo.js";
	import { t } from "$lib/i18n/index.js";
	import { workSources } from "$lib/images.js";

	// Layout-only data (images, sizing, asymmetric grid placement) stays
	// static — only the copy (name/category/desc/tech/year/url) is translated.
	// MOBILE HEIGHTS ARE ASPECT-RATIO, NOT VIEWPORT-HEIGHT — this is the fix
	// for the toolbar jump, and it is the element the report points at.
	//
	// Instrumented ancestor walk from `#work img` up to `html`, captured
	// across a viewport-height change with the width held constant, showed
	// the chain moving like this:
	//
	//   img.absolute        top 200 -> 125   height 615 -> 557
	//   div.relative        top 246 -> 166   height 523 -> 474   <-- the box
	//   a.group             top 246 -> 166   height 611 -> 562
	//   div.px-4            top 246 -> 166   height 2451 -> 2271
	//   section#work        top -131 -> -211 height 3042 -> 2862
	//   main.app-wrapper    top unchanged    height 13969 -> 13628
	//
	// `div.relative` is this box, and it was the first element in the chain
	// to change height — everything above it in the list only moved because
	// this shrank. Its height was `h-[62svh]` etc: a viewport-height unit.
	// Any viewport-height unit is, by definition, a value the browser is
	// entitled to recompute when it decides the viewport changed — and the
	// toolbar showing/hiding is exactly that. When four of these boxes each
	// lose height at once, the section collapses by ~180px and every pixel
	// of the document below it slides up, while `window.scrollY` never
	// changes and no GSAP value changes. That is precisely the captured
	// signature of this bug: scrollY identical, transform identical,
	// getBoundingClientRect().top moved.
	//
	// `aspect-[…]` sizes these boxes from their own WIDTH instead. A mobile
	// toolbar overlays the viewport vertically; it never changes the
	// viewport's width. So a width-derived height cannot move when the
	// toolbar appears — not "usually doesn't", cannot, regardless of how a
	// given browser or in-app WebView implements svh/lvh/dvh. The ratios
	// are picked to match the previous rendered heights at a typical phone
	// width (390px): 3/4 -> 520px vs 62svh -> 523px, 8/9 -> 439 vs 439,
	// 4/5 -> 487 vs 490, 6/7 -> 455 vs 456 — visually the same layout.
	//
	// Desktop is deliberately untouched: `md:aspect-auto md:h-[…svh]` keeps
	// the exact previous desktop sizing, and desktop browsers never resize
	// the viewport mid-scroll anyway.
	const layout = [
		{ image: imgCabana, sources: workSources("cabana-svinita"), height: "aspect-[3/4] md:aspect-auto md:h-[78svh]", colStart: "md:col-start-1", colSpan: "md:col-span-7", offsetTop: "" },
		{ image: imgRodica, sources: workSources("rodica-chiriches"), height: "aspect-[8/9] md:aspect-auto md:h-[60svh]", colStart: "md:col-start-6", colSpan: "md:col-span-7", offsetTop: "md:mt-24" },
		{ image: imgSeeker, sources: workSources("seeker"), height: "aspect-[4/5] md:aspect-auto md:h-[70svh]", colStart: "md:col-start-1", colSpan: "md:col-span-6", offsetTop: "md:mt-32" },
		{ image: imgMysticpuff, sources: workSources("mysticpuff"), height: "aspect-[6/7] md:aspect-auto md:h-[62svh]", colStart: "md:col-start-7", colSpan: "md:col-span-6", offsetTop: "md:mt-4" },
	];

	// The image box is roughly half the 1600px grid on desktop and full-bleed
	// on mobile; `sizes` lets the browser pick the smallest variant that still
	// covers the slot at the device's pixel ratio.
	const SIZES = "(min-width: 768px) 50vw, 100vw";

	let projects = $derived($t.work.projects.map((p, i) => ({ ...p, ...layout[i] })));

	// This section used to reveal each card with a scroll-triggered GSAP
	// fade/slide-up, plus a CSS scale-up on hover/tap. Both are gone: on a
	// real phone the reveal tween was firing on cards well below the
	// Services→Work handoff that was already glitching (see Services.svelte),
	// and made that stretch of the page feel like it was fighting itself.
	// Removed rather than tuned — the cards are static now, always at their
	// final state, nothing here writes to transform/opacity on scroll or on
	// touch. Simpler and steadier beats a subtler version of the same class
	// of bug.
</script>

<section id="work" class="w-full bg-white text-black py-24 md:py-40 relative">
	<div
		class="px-6 md:px-12 max-w-7xl mx-auto mb-14 md:mb-28 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
	>
		<h2 class="font-display text-6xl sm:text-7xl md:text-8xl tracking-tight leading-[0.95]">
			{$t.work.title1}<br /><span class="font-serif-italic text-black/35">{$t.work.title2}</span>
		</h2>
		<p class="text-black/50 font-sans max-w-sm text-base md:text-lg leading-relaxed pb-2">
			{$t.work.desc}
		</p>
	</div>

	<div class="px-4 md:px-8 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-16 md:gap-y-6">
		{#each projects as project, i}
			<a
				href={project.url}
				target="_blank"
				rel="noopener noreferrer"
				data-cursor-label={$t.work.viewProject}
				class="group col-span-1 {project.colSpan} {project.colStart} {project.offsetTop} block cursor-pointer"
			>
				<div class="relative overflow-hidden rounded-2xl {project.height} bg-[#F7F7F8]">
					<picture class="contents">
						<source type="image/avif" srcset={project.sources.avif} sizes={SIZES} />
						<source type="image/webp" srcset={project.sources.webp} sizes={SIZES} />
						<!-- Static on purpose: this used to scale up on hover/tap
						     (group-hover:scale-110). On iOS Safari a tap can leave
						     :hover "stuck" on until the user taps elsewhere, so the
						     image could end up permanently zoomed-in/cropped-looking
						     on mobile — reported as part of the Work section "breaking".
						     The image no longer moves at all.

						     object-contain, not object-cover: the mobile boxes
						     (aspect-[3/4] etc) and the desktop boxes (fixed md:h-[Nsvh]
						     against a much wider column) have very different aspect
						     ratios from each other and from the source photos. `cover`
						     filled every box but cropped the photo differently at each
						     breakpoint — on the widest desktop cards that cropped into
						     the phone itself. `contain` always shows the whole photo,
						     letterboxed on the card's own bg-[#F7F7F8] where the aspect
						     doesn't match, so nothing is ever cut off on phone or on
						     desktop. -->
						<img
							src={project.image}
							alt="{project.name} — {project.category}"
							width="960"
							height="1200"
							loading="lazy"
							decoding="async"
							class="absolute inset-0 w-full h-full object-contain"
						/>
					</picture>
					<!-- On mobile there's no hover, so this overlay (and the tags below)
					     stay permanently visible; on desktop it still only shows on hover. -->
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"
					></div>
					<div
						class="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-0 md:translate-y-6 opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500 flex items-center justify-between gap-3"
					>
						<span class="text-white text-sm font-mono uppercase tracking-widest">{project.tech}</span>
						<span
							class="md:hidden flex-shrink-0 inline-flex items-center gap-1.5 text-white text-xs font-mono uppercase tracking-widest bg-[#5B21F5] rounded-full px-3 py-1.5"
							>{$t.work.viewProject} →</span
						>
					</div>
					<span
						class="absolute top-5 right-5 md:top-6 md:right-6 text-xs font-mono uppercase tracking-widest text-white bg-[#5B21F5] rounded-full px-3 py-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"
						>{project.year}</span
					>
				</div>

				<div class="flex items-end justify-between mt-6 gap-6">
					<div>
						<div class="flex items-baseline gap-3">
							<span class="font-mono text-xs text-black/30">{project.id}</span>
							<h3 class="font-display text-3xl md:text-5xl group-hover:text-[#5B21F5] transition-colors duration-300">
								{project.name}
							</h3>
						</div>
						<p class="text-black/45 font-sans font-light mt-1">{project.category}</p>
					</div>
					<p class="hidden md:block text-black/40 text-sm max-w-[220px] leading-relaxed text-right">
						{project.desc}
					</p>
				</div>
			</a>
		{/each}
	</div>

	<div class="flex justify-center mt-16 md:mt-24">
		<a
			href="#contact"
			onclick={(e) => scrollToSection(e, "#contact")}
			use:fillPress
			class="px-8 py-4 rounded-full border border-black/15 text-black/70 hover:bg-black hover:text-white hover:border-black transition-colors duration-500 font-sans text-sm font-medium"
		>
			{$t.work.cta}
		</a>
	</div>
</section>
