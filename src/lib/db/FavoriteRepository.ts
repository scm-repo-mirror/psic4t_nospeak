import { db, type FavoriteItem } from './db';

export class FavoriteRepository {
    public async addFavorite(eventId: string, conversationId: string): Promise<void> {
        await db.favorites.put({
            eventId,
            conversationId,
            createdAt: Date.now()
        });
    }

    public async removeFavorite(eventId: string): Promise<void> {
        await db.favorites.delete(eventId);
    }

    public async isFavorite(eventId: string): Promise<boolean> {
        const count = await db.favorites.where('eventId').equals(eventId).count();
        return count > 0;
    }

    public async getFavorites(): Promise<FavoriteItem[]> {
        return await db.favorites.toArray();
    }

    public async getFavoriteEventIds(): Promise<Set<string>> {
        const favorites = await db.favorites.toArray();
        return new Set(favorites.map(f => f.eventId));
    }
}

export const favoriteRepo = new FavoriteRepository();
