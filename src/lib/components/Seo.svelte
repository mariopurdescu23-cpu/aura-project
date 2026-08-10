<script>
	let {
		title = "Weberescu — Software & Web Design",
		description = "Weberescu — Site-uri de prezentare, magazine online și SEO, făcute de la zero pentru afaceri din România. Prețuri clare, livrare rapidă.",
		url = "https://weberescu.ro",
		image = "https://weberescu.ro/og-image.png",
	} = $props();
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta name="robots" content="index, follow" />
	<meta name="theme-color" content="#050505" />
	<meta name="author" content="Weberescu" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={url} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={image} />

	<script type="application/ld+json">
{JSON.stringify({
	"@context": "https://schema.org",
	"@type": "ProfessionalService",
	"name": "Weberescu",
	"url": "https://weberescu.ro",
	"email": "contact@weberescu.ro",
	"description": description,
	"image": image,
	"priceRange": "1000 RON - 5000 RON",
	"areaServed": "RO",
	"serviceType": ["Web Design", "Dezvoltare Site-uri", "Magazine Online", "SEO"]
})}
</script>
<link rel="canonical" href={url} />
</svelte:head>
