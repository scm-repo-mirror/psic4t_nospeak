import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8')) as { version: string };

export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(packageJson.version)
	},
	plugins: [
		sveltekit(),
		VitePWA({
			strategies: 'injectManifest',
			srcDir: 'src',
			filename: 'service-worker.ts',
			registerType: 'autoUpdate',
			scope: '/',
			base: '/',
			includeAssets: ['robots.txt', 'favicons/*.png', 'favicons/*.ico', 'nospeak.svg'],
			manifest: {
				name: 'nospeak-web',
				short_name: 'nospeak',
				description: 'A Nostr-based messaging application',
				theme_color: '#000000',
				background_color: '#ffffff',
				display: 'standalone',
				start_url: '/',
				icons: [
					{
						src: '/nospeak.svg',
						sizes: 'any',
						type: 'image/svg+xml',
						purpose: 'any maskable'
					},
					{
						src: '/favicons/favicon-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/favicons/favicon-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		})
	]
});
