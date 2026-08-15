import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";

let registered = false;

export function scrollToSection(evt, id, offset = 40) {
	evt.preventDefault();

	if (!registered) {
		gsap.registerPlugin(ScrollToPlugin);
		registered = true;
	}

	gsap.to(window, {
		duration: 2.2,
		scrollTo: { y: id, offsetY: offset },
		ease: "power3.inOut",
	});
}
