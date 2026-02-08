import { db, type ArchiveItem } from './db';

export class ArchiveRepository {
    public async addArchive(conversationId: string): Promise<void> {
        await db.archives.put({
            conversationId,
            archivedAt: Date.now()
        });
    }

    public async removeArchive(conversationId: string): Promise<void> {
        await db.archives.delete(conversationId);
    }

    public async isArchived(conversationId: string): Promise<boolean> {
        const count = await db.archives.where('conversationId').equals(conversationId).count();
        return count > 0;
    }

    public async getArchives(): Promise<ArchiveItem[]> {
        return await db.archives.toArray();
    }

    public async getArchivedConversationIds(): Promise<Set<string>> {
        const archives = await db.archives.toArray();
        return new Set(archives.map(a => a.conversationId));
    }
}

export const archiveRepo = new ArchiveRepository();
