/**
 * Single source of truth for each work project's image + responsive sources,
 * keyed by slug — shared between the WorkShowcase cards and the standalone
 * `/lucrari/[slug]` pages so both read the exact same asset.
 */
import { workSources } from "./images.js";
import imgCabana from "$lib/assets/work/cabana-svinita.jpg";

export const workSlugs = ["cabana-svinita"];

const images = {
	"cabana-svinita": imgCabana,
};

/** `slug` is one of `workSlugs`. */
export function getWorkImage(slug) {
	return { image: images[slug], sources: workSources(slug) };
}
