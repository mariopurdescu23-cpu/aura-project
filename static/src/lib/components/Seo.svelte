<script>
	import { t, lang } from "$lib/i18n/index.js";

	let {
		title = $t.seo.title,
		description = $t.seo.description,
		keywords = $t.seo.keywords,
		url = "https://weberescu.ro",
		image = "https://weberescu.ro/og-image.png",
	} = $props();

	// og:locale wants underscore-joined region tags, not the bare "ro"/"en"
	// this site's language store uses.
	let ogLocale = $derived($lang === "ro" ? "ro_RO" : "en_US");
	let ogLocaleAlt = $derived($lang === "ro" ? "en_US" : "ro_RO");

	// Structured data: one script tag for the business itself, another for
	// the work shown in the Work section, so each project is independently
	// eligible for rich results (e.g. Google's "Projects/Work" carousel)
	// instead of being invisible inside a single opaque description string.
	let businessLd = $derived({
		"@context": "https://schema.org",
		"@type": "ProfessionalService",
		name: "Weberescu",
		url: "https://weberescu.ro",
		email: "contact@weberescu.ro",
		description,
		image,
		logo: "https://weberescu.ro/og-image.png",
		areaServed: "Europe",
		sameAs: [
			"https://instagram.com/weberescu",
			"https://www.facebook.com/people/Weberescu/61592492747692/",
			"https://tiktok.com/@weberescu",
		],
		serviceType: [
			"Software Development",
			"Web Design",
			"UI/UX Design",
			"SaaS Development",
			"AI Integrations",
			"Digital Products",
		],
	});

	let workLd = $derived({
		"@context": "https://schema.org",
		"@type": "ItemList",
		itemListElement: $t.work.projects.map((p, i) => ({
			"@type": "ListItem",
			position: i + 1,
			item: {
				"@type": "CreativeWork",
				name: p.name,
				description: p.desc,
				url: p.url,
				about: p.category,
				dateCreated: p.year,
				creator: { "@type": "Organization", name: "Weberescu", url: "https://weberescu.ro" },
			},
		})),
	});

	// A script element is an HTML "raw text" element (same family as style
	// and textarea): the spec says its content is never parsed for markup,
	// so Svelte's compiler captures everything between the tags as one
	// opaque text blob before it ever looks for an expression or an html
	// directive inside it. A literal script tag with a JSON.stringify
	// expression as its child content, which is what this file (and the
	// original ProfessionalService block it replaced) had, therefore ships
	// to the browser as literal unevaluated source text, not JSON. No
	// crawler could ever have parsed it as structured data.
	//
	// The fix builds the entire tag, script wrapper included, as one
	// string, and injects it via the html directive used directly inside
	// svelte:head below, not nested inside a literal script element. Used
	// there, the html directive behaves like innerHTML, which does create
	// a real script element from the string; it just never executes it as
	// JS, which is exactly what an application/ld+json tag wants anyway,
	// since crawlers only read its text content. The angle bracket before
	// "script" is escaped to its unicode form so a stray closing script
	// sequence inside any field (a project description, etc.) can't
	// terminate the tag early.
	const ldJsonTag = (obj) =>
		`<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}<\/script>`;
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />
	<!-- max-image-preview / max-snippet / max-video-preview: without these
	     Google defaults to conservative snippet/thumbnail limits for some
	     locales — this opts back into full-size preview images and
	     unrestricted text snippets in search results. -->
	<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<meta name="theme-color" content="#ffffff" />
	<meta name="author" content="Weberescu" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:site_name" content="Weberescu" />
	<meta property="og:locale" content={ogLocale} />
	<meta property="og:locale:alternate" content={ogLocaleAlt} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Weberescu — Software Development & Web Design" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={url} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={image} />

	{@html ldJsonTag(businessLd)}
	{@html ldJsonTag(workLd)}
	<link rel="canonical" href={url} />
</svelte:head>
