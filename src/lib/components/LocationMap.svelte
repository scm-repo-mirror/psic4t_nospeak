<script lang="ts">
    import { onMount } from 'svelte';
    import { t } from '$lib/i18n';
    import 'leaflet/dist/leaflet.css';
    import {
        type LocationPoint,
        MAP_TILE_URL,
        MAP_ATTRIBUTION,
        MAP_ZOOM,
        MAP_HEIGHT_BUBBLE,
        buildOsmOpenUrl
    } from '$lib/core/MapUtils';

    interface Props {
        latitude: number;
        longitude: number;
        height?: number;
        interactive?: boolean;
    }

    let { latitude, longitude, height = MAP_HEIGHT_BUBBLE, interactive = true }: Props = $props();

    let mapContainer: HTMLDivElement | undefined = $state();
    let map: L.Map | undefined = $state();

    const point: LocationPoint = $derived({ latitude, longitude });
    const openMapUrl = $derived(buildOsmOpenUrl(point));

    onMount(() => {
        if (!mapContainer) return;

        // Dynamic import to avoid SSR issues with Leaflet (it accesses `window`)
        import('leaflet').then((L) => {
            if (!mapContainer) return;

            map = L.map(mapContainer, {
                zoomControl: interactive,
                dragging: interactive,
                touchZoom: interactive,
                scrollWheelZoom: interactive,
                doubleClickZoom: interactive,
                boxZoom: interactive,
                keyboard: interactive,
                attributionControl: false
            }).setView([latitude, longitude], MAP_ZOOM);

            L.tileLayer(MAP_TILE_URL, {
                attribution: MAP_ATTRIBUTION,
                maxZoom: 19
            }).addTo(map);

            // Fix default marker icon path issue with bundlers
            const defaultIcon = L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            L.marker([latitude, longitude], { icon: defaultIcon }).addTo(map);
        });

        return () => {
            if (map) {
                map.remove();
                map = undefined;
            }
        };
    });
</script>

<div class="location-map-wrapper">
    <div
        bind:this={mapContainer}
        class="rounded-xl overflow-hidden bg-gray-100/80 dark:bg-slate-800/80 border border-gray-200/60 dark:border-slate-700/60"
        style="width: 100%; height: {height}px;"
    ></div>
    {#if openMapUrl}
        <a
            href={openMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="typ-meta text-xs underline hover:opacity-80"
        >
            {$t('modals.locationPreview.openInOpenStreetMap')}
        </a>
    {/if}
</div>

<style>
    .location-map-wrapper :global(.leaflet-container) {
        font-family: inherit;
        border-radius: 0.75rem;
    }


</style>
