import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: '0.0.0.0',
		...(process.env.OUTER_PORT_FRONTEND && process.env.INNER_PORT_FRONTEND
			? {
					hmr: process.env.CODESPACES
						? false
						: {
								clientPort: parseInt(process.env.OUTER_PORT_FRONTEND)
						  },
					port: parseInt(process.env.INNER_PORT_FRONTEND)
			  }
			: {}),
		watch: {
			usePolling: true
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
