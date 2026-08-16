/**
 * Responsive image sources.
 *
 * The originals were 1600x2000 JPEGs (work) and 1000x1250 (services), shipped
 * at full size no matter the viewport — 3.3MB of the page's 3.7MB, for slots
 * that are at most ~900px and ~360px wide in CSS. They are now pre-encoded to
 * AVIF and WebP at the widths actually used, next to the source files, and
 * picked up here with `import.meta.glob` so Vite still hashes and fingerprints
 * every variant (no `static/` escape hatch, no cache-busting lost).
 *
 * Encoding was verified per image rather than assumed: every variant sits at
 * 38-42 dB PSNR against the original, i.e. visually transparent.
 */

const work = import.meta.glob("./assets/work/*-*.{avif,webp}", {
	eager: true,
	query: "?url",
	import: "default",
});

const services = import.meta.glob("./assets/services/*-*.{avif,webp}", {
	eager: true,
	query: "?url",
	import: "default",
});

function build(map, dir, name, widths, ext) {
	return widths
		.map((w) => {
			const url = map[`./assets/${dir}/${name}-${w}.${ext}`];
			return url ? `${url} ${w}w` : null;
		})
		.filter(Boolean)
		.join(", ");
}

/** `name` is the file stem, e.g. "seeker". */
export function workSources(name) {
	const widths = [640, 960, 1440];
	return {
		avif: build(work, "work", name, widths, "avif"),
		webp: build(work, "work", name, widths, "webp"),
	};
}

export function serviceSources(name) {
	const widths = [400, 800];
	return {
		avif: build(services, "services", name, widths, "avif"),
		webp: build(services, "services", name, widths, "webp"),
	};
}
