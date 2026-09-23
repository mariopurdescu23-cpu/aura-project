import peiuPhoto from "$lib/assets/testimonials/peiu-laurentiu.jpg";

export const ro = {
	seo: {
		title: "Weberescu — Dezvoltare Software & Web Design | România",
		description:
			"Studio independent de software și web design din România. Construim site-uri, platforme web și produse digitale pentru afaceri ambițioase — de la primul draft până la livrare.",
		keywords:
			"dezvoltare software, creare site web, web design, agenție web România, SvelteKit, aplicații web, UI/UX, produse digitale, automatizări AI",
	},
	nav: {
		work: "Lucrări",
		services: "Servicii",
		about: "Despre noi",
		contact: "Contact",
		cta: "Hai să vorbim",
		language: "Limbă",
		langRO: "Română",
		langEN: "Engleză",
		openMenu: "Deschide meniul",
		closeMenu: "Închide meniul",
	},
	hero: {
		metaLeft: "Software / Design / Produse Digitale",
		metaRight: "Agenție de software și design — cu sediul în Europa, activ global",
		line1: "SOFTWARE",
		line2: "SHOULD FEEL",
		line3: "different.",
		desc: "Proiectăm și construim produse digitale pentru companii ambițioase — software, platforme web și sistemele din spatele lor.",
		ctaPrimary: "Hai să vorbim →",
		ctaSecondary: "Vezi lucrările",
		scroll: "Scroll",
	},
	manifesto: {
		label: "Manifest",
		text: "Nu construim doar site-uri web. Construim experiențe digitale pe care oamenii le țin minte — cu același rigoare cu care o echipă de produs ar trata software-ul, și aceeași grijă cu care un studio ar trata design-ul.",
		accents: ["experiențe", "minte", "software-ul,", "design-ul."],
	},
	services: {
		label: "Servicii",
		title1: "Ce facem,",
		title2: "pe scurt.",
		viewMore: "Vezi detalii",
		backToServices: "Servicii",
		whatYouGet: "Ce primești",
		processLeadIn: "Indiferent de serviciu, colaborarea urmează același proces clar, în patru pași:",
		items: [
			{
				num: "01",
				title: "Dezvoltare Software",
				desc: "Aplicații și platforme personalizate, construite pentru scalare, pe o arhitectură care rămâne mentenabilă pe măsură ce creșteți.",
				intro: "Lucrăm cu companii care au deja un produs sau un proces intern greoi și au nevoie de software construit corect de la bază — nu un prototip rapid care se destramă la prima creștere. Fiecare decizie tehnică e discutată deschis, cu argumente, nu impusă din spatele unui contract.",
				tags: ["Aplicații web", "Instrumente interne", "API-uri"],
				features: [
					{ title: "Arhitectură curată", desc: "Cod structurat de la prima linie, gândit să rămână ușor de întreținut și extins pe măsură ce echipa și produsul cresc." },
					{ title: "API-uri și integrări", desc: "Servicii backend robuste și integrări cu sistemele existente, documentate și testate înainte de livrare." },
					{ title: "Cod pe care îl deții", desc: "Predăm codul sursă complet, fără dependențe ascunse sau vendor lock-in." },
					{ title: "Suport post-lansare", desc: "Rămânem alături după livrare pentru bugfixing și ajustări — nu dispărem după factura finală." },
				],
			},
			{
				num: "02",
				title: "Web Design",
				desc: "Site-uri de nivel editorial, lucrate cu grijă, care lasă o primă impresie de neuitat — și se încarcă la fel de rapid.",
				intro: "Un site bun nu e doar frumos — trebuie să convertească, să se încarce rapid și să reziste în timp fără să pară învechit peste un an. Combinăm direcție de artă originală cu inginerie front-end solidă, ca rezultatul să arate la fel de bine cum se și comportă.",
				tags: ["Direcție de artă", "Motion", "Sisteme de design"],
				features: [
					{ title: "Direcție de artă proprie", desc: "Fiecare site pleacă de la o direcție vizuală originală, nu de la un șablon reciclat." },
					{ title: "Performanță reală", desc: "Optimizat din construcție pentru scoruri PageSpeed mari, nu adăugat ca gând ulterior." },
					{ title: "Motion cu scop", desc: "Animații care ghidează atenția și explică, nu decorează fără rost." },
					{ title: "Responsive până la pixel", desc: "Testat pe telefoane, tablete și desktop reale, nu doar în DevTools." },
				],
			},
			{
				num: "03",
				title: "UI / UX",
				desc: "Interfețe gândite pentru claritate, viteză și modul real în care gândesc oamenii — nu cum presupune un șablon că gândesc.",
				intro: "Nu desenăm ecrane izolate — construim fluxuri complete, testate cu oameni reali înainte să ajungă în producție. Scopul nu e un portofoliu frumos de mockup-uri, ci o interfață pe care utilizatorii chiar o înțeleg din prima.",
				tags: ["Design de produs", "Prototipare", "Cercetare"],
				features: [
					{ title: "Cercetare înainte de pixeli", desc: "Înțelegem utilizatorii și obiectivele de business înainte de a desena primul ecran." },
					{ title: "Prototipuri testabile", desc: "Fluxuri interactive pe care le poți testa cu utilizatori reali înainte să se scrie cod." },
					{ title: "Sisteme de design", desc: "Componente consistente și reutilizabile, nu ecrane desenate izolat unul de altul." },
					{ title: "Accesibilitate by default", desc: "Contrast, focus states și navigare de la tastatură gândite din prima iterație." },
				],
			},
			{
				num: "04",
				title: "SaaS & Platforme",
				desc: "Design și inginerie completă pentru companii de software care construiesc chiar produsul pe care se bazează întreaga afacere.",
				intro: "Lucrăm cu fondatori și echipe tehnice care construiesc produsul central al afacerii lor, nu un site de prezentare. Arhitectura, autentificarea și facturarea sunt gândite corect din prima versiune, ca să nu fie nevoie de o rescriere costisitoare peste un an.",
				tags: ["De la MVP la scalare", "Dashboard-uri", "Facturare & autentificare"],
				features: [
					{ title: "De la MVP la scalare", desc: "Arhitectură pregătită să crească de la primii utilizatori la mii de conturi active." },
					{ title: "Facturare & abonamente", desc: "Integrări Stripe sau alte procesatoare, cu planuri, trial-uri și upgrade-uri gestionate corect." },
					{ title: "Panouri de administrare", desc: "Dashboard-uri interne pentru echipa ta, nu doar interfața pentru clienți." },
					{ title: "Autentificare securizată", desc: "Login, roluri și permisiuni implementate corect din prima versiune, nu adăugate în grabă mai târziu." },
				],
			},
			{
				num: "05",
				title: "AI & Automatizare",
				desc: "Integrări AI și automatizări practice care elimină frecarea din fluxuri de lucru reale — nu AI de dragul AI-ului.",
				intro: "Nu pornim de la „hai să băgăm AI undeva” — pornim de la un proces real care consumă timp și încercăm să vedem dacă un model sau o automatizare chiar îl rezolvă. Dacă răspunsul e nu, spunem asta direct, în loc să vindem o funcționalitate inutilă.",
				tags: ["Integrări LLM", "Automatizare", "Copiloți interni"],
				features: [
					{ title: "Integrări LLM practice", desc: "Funcționalități AI care rezolvă o problemă reală de business, nu un chatbot decorativ." },
					{ title: "Automatizare de fluxuri", desc: "Eliminăm task-urile repetitive din operațiuni, de la procesare de date la notificări." },
					{ title: "Copiloți interni", desc: "Instrumente AI construite pentru echipa ta, adaptate la datele și procesele voastre." },
					{ title: "Costuri sub control", desc: "Alegem modelul și arhitectura potrivite ca să nu plătești pentru putere de calcul de care nu ai nevoie." },
				],
			},
			{
				num: "06",
				title: "Produse Digitale",
				desc: "De la prima schiță la produsul livrat: sisteme de design, prototipuri și cod de producție, sub același acoperiș.",
				intro: "Potrivit pentru echipe care pornesc de la zero sau relansează un produs și au nevoie de un singur partener pentru tot procesul — cercetare, design, dezvoltare și lansare — în loc să coordoneze trei furnizori diferiți care nu comunică între ei.",
				tags: ["Branding", "Sisteme de design", "Livrare completă"],
				features: [
					{ title: "De la schiță la lansare", desc: "Acoperim tot procesul — cercetare, design, dezvoltare și lansare — sub același acoperiș." },
					{ title: "Branding coerent", desc: "Identitate vizuală aliniată cu produsul, nu un logo desenat separat de restul experienței." },
					{ title: "Sisteme de design", desc: "Fundații reutilizabile care accelerează orice ecran sau funcționalitate viitoare." },
					{ title: "Livrare completă", desc: "Predăm un produs funcțional, documentat și gata de folosit — nu doar fișiere de design." },
				],
			},
		],
	},
	work: {
		title1: "Lucrări",
		title2: "selectate.",
		desc: "O parte din produsele, platformele și experiențele pe care le-am livrat pentru clienți reali — dă click pe orice proiect pentru detalii complete.",
		cta: "Începe-ți proiectul →",
		viewProject: "Vezi proiectul",
		backToWork: "Lucrări",
		viewLive: "Vezi site-ul live",
		projects: [
			{
				id: "01",
				slug: "cabana-svinita",
				name: "A-Frame Svinița",
				category: "Site de rezervări cabană",
				year: "2026",
				desc: "Un site cald, dominat de imagine, pentru o cabană de vacanță în stil A-Frame — construit ca să transforme vizitele în rezervări.",
				intro: "Proprietarii aveau nevoie de un site care să vândă atmosfera locului la fel de bine cum o fac fotografiile de pe Instagram, dar cu un motor de rezervări funcțional în spate — nu doar un formular de contact static.",
				tech: "SvelteKit · Motor de rezervări",
				url: "https://aframe-svinita.ro",
				highlights: [
					{ title: "Motor de rezervări integrat", desc: "Disponibilitate în timp real, fără telefoane sau mesaje înainte și înapoi pentru fiecare rezervare." },
					{ title: "Design dominat de imagine", desc: "Fotografiile cabanei și ale zonei sunt protagoniste, nu doar decor în fundal." },
					{ title: "Optimizat pentru mobil", desc: "Majoritatea vizitatorilor descoperă cabana de pe telefon, deci acolo trebuia să funcționeze impecabil." },
				],
			},
		],
	},
	capabilities: {
		label: "Capabilități",
		title1: "Uneltele la care apelăm",
		title2: "când contează.",
		groups: [
			{
				label: "Frontend",
				items: [
					{ name: "Svelte", weight: "big", accent: true },
					{ name: "React", weight: "med" },
					{ name: "Next.js", weight: "big" },
					{ name: "TypeScript", weight: "sm" },
					{ name: "Three.js", weight: "med", accent: true },
					{ name: "GSAP", weight: "sm" },
				],
			},
			{
				label: "Backend",
				items: [
					{ name: "Node.js", weight: "big" },
					{ name: "Python", weight: "med", accent: true },
					{ name: "PostgreSQL", weight: "sm" },
					{ name: "REST / GraphQL", weight: "sm" },
					{ name: "Edge Functions", weight: "med" },
				],
			},
			{
				label: "AI",
				items: [
					{ name: "OpenAI", weight: "big", accent: true },
					{ name: "Integrări LLM", weight: "med" },
					{ name: "Pipeline-uri RAG", weight: "sm" },
					{ name: "Automatizare", weight: "big" },
				],
			},
			{
				label: "Design",
				items: [
					{ name: "Figma", weight: "big" },
					{ name: "Prototipare", weight: "sm" },
					{ name: "Sisteme de design", weight: "med", accent: true },
					{ name: "Motion Design", weight: "sm" },
				],
			},
		],
	},
	about: {
		label: "Despre noi",
		title: "Despre Weberescu",
		paragraphs: [
			"Weberescu este un proiect independent dedicat dezvoltării de website-uri, soluții software și concepte digitale.",
			"Construim și testăm proiecte pentru a explora idei, tehnologii și direcții de design, cu accent pe experiența utilizatorului, funcționalitate și performanță.",
			"Portofoliul nostru include proiecte și concepte dezvoltate de noi în scop demonstrativ sau experimental.",
		],
		principles: [
			{ n: "01", title: "Măiestria înaintea vitezei", desc: "Preferăm să livrăm cu o săptămână mai târziu, dar corect." },
			{ n: "02", title: "Design și cod, împreună", desc: "Aceiași oameni care proiectează ajută și la construcție." },
			{ n: "03", title: "Fără umplutură inutilă", desc: "Fiecare ecran, propoziție și animație își are rostul." },
		],
	},
	process: {
		label: "Proces",
		title1: "Patru pași.",
		title2: "Fără surprize.",
		steps: [
			{
				n: "01",
				title: "Descoperire",
				desc: "Începem prin a înțelege afacerea, nu doar brief-ul — obiective, constrângeri și cum arată, de fapt, succesul.",
			},
			{
				n: "02",
				title: "Design",
				desc: "Concepte, direcție de artă și design de interfață, rafinate în cicluri scurte până când direcția simte evident corect.",
			},
			{
				n: "03",
				title: "Construcție",
				desc: "Inginerie de nivel producție, în mod transparent — linkuri de staging, check-in-uri săptămânale, fără cutie neagră până la lansare.",
			},
			{
				n: "04",
				title: "Lansare",
				desc: "Lansăm, măsurăm și rămânem aproape în săptămânile următoare — prima versiune e un început, nu o linie de sosire.",
			},
		],
	},
	testimonials: {
		label: "Testimoniale",
		title1: "Ce spun",
		title2: "clienții noștri.",
		// DRAFT: testimonialul cu nume real (Peiu Laurentiu) e scris de noi pe
		// baza proiectului livrat, nu e citat obținut de la client. Trebuie
		// confirmat cu el înainte de publicare pe site-ul live.
		feedbacks: [
			{
				name: "Peiu Laurentiu",
				initials: "PL",
				photo: peiuPhoto,
				role: "Fondator, A-Frame Svinița",
				text: "Aveam nevoie de un site care să transforme vizitatorii curioși în rezervări reale — și exact asta au livrat. Arată la fel de bine ca experiența pe care o oferim la cabană, iar rezervările au venit de la sine.",
			},
		],
	},
	cta: {
		label: "Hai să vorbim",
		line1: "HAI SĂ CREĂM",
		line2: "CEVA",
		line3: "de neuitat.",
		button: "Hai să vorbim",
		note: "Sau scrie-ne la",
	},
	footer: {
		desc: "Agenție de software și web design cu peste 5 ani de experiență, care proiectează și construiește produse digitale pentru companii ambițioase.",
		booking: "Programări deschise pentru Q4 2026",
		navigate: "Navigare",
		studio: "Studio",
		location: "București, România",
		social: "Social",
		rights: "Toate drepturile rezervate.",
		credit: "Design & cod, Weberescu.",
	},
};
