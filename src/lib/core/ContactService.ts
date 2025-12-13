import { profileResolver } from '$lib/core/ProfileResolver';
import { contactRepo } from '$lib/db/ContactRepository';

export async function addContactByNpub(npub: string): Promise<void> {
    const trimmed = npub.trim();

    if (!trimmed.startsWith('npub')) {
        throw new Error('Invalid npub');
    }

    await profileResolver.resolveProfile(trimmed, true);
    await contactRepo.addContact(trimmed);
}
