/**
 * Single source of truth for each service's image + responsive sources,
 * keyed by slug — shared between the Services cards and the standalone
 * `/servicii/[slug]` pages so both read the exact same asset.
 */
import { serviceSources } from "./images.js";
import imgSoftware from "$lib/assets/services/software-development.jpg";
import imgWebDesign from "$lib/assets/services/web-design.jpg";
import imgUiUx from "$lib/assets/services/ui-ux.jpg";
import imgSaas from "$lib/assets/services/saas-platforms.jpg";
import imgAi from "$lib/assets/services/ai-automation.jpg";
import imgDigitalProducts from "$lib/assets/services/digital-products.jpg";

export const serviceSlugs = [
	"software-development",
	"web-design",
	"ui-ux",
	"saas-platforms",
	"ai-automation",
	"digital-products",
];

const images = {
	"software-development": imgSoftware,
	"web-design": imgWebDesign,
	"ui-ux": imgUiUx,
	"saas-platforms": imgSaas,
	"ai-automation": imgAi,
	"digital-products": imgDigitalProducts,
};

/** `slug` is one of `serviceSlugs`. */
export function getServiceImage(slug) {
	return { image: images[slug], sources: serviceSources(slug) };
}
