import { writable } from 'svelte/store';
import { archiveRepo } from '$lib/db/ArchiveRepository';
import { archiveSyncService } from '$lib/core/ArchiveSyncService';

/**
 * Reactive store holding the Set of archived conversationIds for O(1) UI lookups.
 */
export const archivedConversationIds = writable<Set<string>>(new Set());

/**
 * Load all archives from IndexedDB into the reactive store.
 * Called on app startup and after sync operations.
 */
export async function loadArchives(): Promise<void> {
    const conversationIds = await archiveRepo.getArchivedConversationIds();
    archivedConversationIds.set(conversationIds);
}

/**
 * Toggle archive state for a conversation.
 * Updates local DB, reactive store, and publishes to relays (fire-and-forget).
 */
export async function toggleArchive(conversationId: string): Promise<void> {
    const isArchived = await archiveRepo.isArchived(conversationId);

    if (isArchived) {
        await archiveRepo.removeArchive(conversationId);
        archivedConversationIds.update(set => {
            const next = new Set(set);
            next.delete(conversationId);
            return next;
        });
    } else {
        await archiveRepo.addArchive(conversationId);
        archivedConversationIds.update(set => {
            const next = new Set(set);
            next.add(conversationId);
            return next;
        });
    }

    // Fire-and-forget: sync to relays in background
    archiveSyncService.publishArchives().catch((e) => {
        console.warn('[archives] Background archives sync failed:', e);
    });
}
