import { describe, it, expect, beforeEach, vi } from 'vitest';

const { resolveProfileMock, addContactMock } = vi.hoisted(() => ({
    resolveProfileMock: vi.fn(),
    addContactMock: vi.fn()
}));

vi.mock('$lib/core/ProfileResolver', () => ({
    profileResolver: {
        resolveProfile: resolveProfileMock
    }
}));

vi.mock('$lib/db/ContactRepository', () => ({
    contactRepo: {
        addContact: addContactMock
    }
}));

import { addContactByNpub } from './ContactService';

describe('addContactByNpub', () => {
    beforeEach(() => {
        resolveProfileMock.mockReset();
        addContactMock.mockReset();
    });

    it('trims and adds a valid npub', async () => {
        await addContactByNpub('  npub1validkey ');

        expect(resolveProfileMock).toHaveBeenCalledWith('npub1validkey', true);
        expect(addContactMock).toHaveBeenCalledWith('npub1validkey', expect.any(Number), expect.any(Number));
    });

    it('throws for a non-npub value', async () => {
        await expect(addContactByNpub('not-a-npub')).rejects.toThrow('Invalid npub');
        expect(resolveProfileMock).not.toHaveBeenCalled();
        expect(addContactMock).not.toHaveBeenCalled();
    });
});
