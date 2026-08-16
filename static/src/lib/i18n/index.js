import { writable, derived } from "svelte/store";
import { browser } from "$app/environment";
import { en } from "./en.js";
import { ro } from "./ro.js";

const dictionaries = { en, ro };
const STORAGE_KEY = "weberescu-lang";

// Romanian is the neutral default (this is a .ro business whose examples and
// primary market are Romanian) — English is only served to visitors who show
// a clear signal of being elsewhere. That default also has to match what
// `lang` below starts as, since that starting value is what search engines
// see in the prerendered HTML.
function heuristicLang() {
	if (!browser) return "ro";
	try {
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		if (tz === "Europe/Bucharest" || tz === "Europe/Chisinau") return "ro";
	} catch (e) {
		/* noop */
	}
	const nav = navigator.language ? navigator.language.toLowerCase() : "";
	if (nav.startsWith("ro")) return "ro";
	if (nav.startsWith("en")) return "en";
	return "ro";
}

// Starting value doubles as the language search engines index: this store's
// initial state is what gets baked into the prerendered HTML at build time,
// before any client-side detection below ever runs.
export const lang = writable("ro");
export const t = derived(lang, ($lang) => dictionaries[$lang] || dictionaries.ro);

let initialized = false;

/**
 * Sets the initial language for the visit:
 * 1. A previously saved manual choice always wins.
 * 2. Otherwise, a quick local heuristic (timezone / browser locale) is applied instantly.
 * 3. In the background, we confirm with an IP-based region lookup and correct if needed
 *    (unless the person picks a language manually in the meantime).
 */
export function initLang() {
	if (!browser || initialized) return;
	initialized = true;

	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === "en" || stored === "ro") {
		lang.set(stored);
		return;
	}

	lang.set(heuristicLang());

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 2500);

	fetch("https://get.geojs.io/v1/ip/country.json", { signal: controller.signal })
		.then((r) => r.json())
		.then((data) => {
			if (localStorage.getItem(STORAGE_KEY)) return; // a manual choice happened meanwhile
			const code = (data && data.country_code ? data.country_code : "").toUpperCase();
			if (code) lang.set(code === "RO" || code === "MD" ? "ro" : "en");
		})
		.catch(() => {
			/* network unavailable or blocked — keep the heuristic guess */
		})
		.finally(() => clearTimeout(timeout));
}

export function setLang(value) {
	if (value !== "en" && value !== "ro") return;
	lang.set(value);
	if (browser) localStorage.setItem(STORAGE_KEY, value);
}
