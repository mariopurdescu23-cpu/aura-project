<script>
	import Hero from "$lib/components/Hero.svelte";
	import Manifesto from "$lib/components/Manifesto.svelte";
	import Services from "$lib/components/Services.svelte";
	import WorkShowcase from "$lib/components/WorkShowcase.svelte";
	import Capabilities from "$lib/components/Capabilities.svelte";
	import About from "$lib/components/About.svelte";
	import Process from "$lib/components/Process.svelte";
	import Testimonials from "$lib/components/Testimonials.svelte";
	import Cta from "$lib/components/Cta.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import Seo from "$lib/components/Seo.svelte";
</script>

<Seo />

<div class="bg-white text-black">
	<Hero />
	<Manifesto />
	<Services />
	<WorkShowcase />
	<Capabilities />
	<About />
	<Process />
	<Testimonials />
	<Cta />
	<Footer />
</div>
