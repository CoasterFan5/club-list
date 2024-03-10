import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte'
		})
	],
	server: {
		host: '0.0.0.0',
		hmr: !process.env.CODESPACES,
		port: 3000,
		watch: {
			usePolling: true
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
