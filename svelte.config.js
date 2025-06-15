import adapter from '@sveltejs/adapter-auto';
// import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'; // We'll replace this
import { sveltePreprocess } from 'svelte-preprocess-with-civet';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: sveltePreprocess({
		// or just use sync:true, js true
		civet: { 
			sync: true, 
			js: false, 
			// parseOptions: {
			// 	coffeeIsnt: true,
			// 	coffeeEq: true,
			// 	coffeeBooleans: true,
			// 	coffeeInterpolation: true
			// }
		},
		typescript: true
	}),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;
