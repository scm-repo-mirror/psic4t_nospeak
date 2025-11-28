import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.svg', 'robots.txt'],
			manifest: {
				name: 'Nospeak Web',
				short_name: 'Nospeak',
				description: 'Nostr chat client',
				theme_color: '#ffffff',
				icons: [
					{
						src: 'favicon.svg',
						sizes: '192x192',
						type: 'image/svg+xml'
					}
				]
			}
		})
	]
});
