import { writable } from 'svelte/store';
import { favoriteRepo } from '$lib/db/FavoriteRepository';
import { favoriteSyncService } from '$lib/core/FavoriteSyncService';

/**
 * Reactive store holding the Set of favorited eventIds for O(1) UI lookups.
 */
export const favoriteEventIds = writable<Set<string>>(new Set());

/**
 * Load all favorites from IndexedDB into the reactive store.
 * Called on app startup and after sync operations.
 */
export async function loadFavorites(): Promise<void> {
    const eventIds = await favoriteRepo.getFavoriteEventIds();
    favoriteEventIds.set(eventIds);
}

/**
 * Toggle favorite state for a message.
 * Updates local DB, reactive store, and publishes to relays (fire-and-forget).
 */
export async function toggleFavorite(eventId: string, conversationId: string): Promise<void> {
    const isFav = await favoriteRepo.isFavorite(eventId);

    if (isFav) {
        await favoriteRepo.removeFavorite(eventId);
        favoriteEventIds.update(set => {
            const next = new Set(set);
            next.delete(eventId);
            return next;
        });
    } else {
        await favoriteRepo.addFavorite(eventId, conversationId);
        favoriteEventIds.update(set => {
            const next = new Set(set);
            next.add(eventId);
            return next;
        });
    }

    // Fire-and-forget: sync to relays in background
    favoriteSyncService.publishFavorites().catch((e) => {
        console.warn('[favorites] Background favorites sync failed:', e);
    });
}
