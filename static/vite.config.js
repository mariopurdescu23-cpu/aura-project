import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		// Vite inlines assets under 4KB as base64 data URLs by default. Once the
		// images were re-encoded, most responsive variants fell under that limit
		// and 19 of them got baked into the route chunk — ~66KB of base64 that
		// gzips badly, sits on the critical JS path, and can never be lazily
		// loaded or picked conditionally by <picture>. Images always stay as
		// separate cacheable files; everything else keeps the default behaviour.
		assetsInlineLimit: (filePath) =>
			/\.(avif|webp|png|jpe?g|gif)$/i.test(filePath) ? false : undefined
	}
});
