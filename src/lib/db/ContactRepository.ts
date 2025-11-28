import { db, type ContactItem } from './db';

export class ContactRepository {
    public async addContact(npub: string) {
        await db.contacts.put({
            npub,
            createdAt: Date.now()
        });
    }

    public async removeContact(npub: string) {
        await db.contacts.delete(npub);
    }

    public async getContacts(): Promise<ContactItem[]> {
        return await db.contacts.toArray();
    }
}

export const contactRepo = new ContactRepository();
