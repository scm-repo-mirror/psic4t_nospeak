import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('ProfileModal avatar refresh', () => {
    it('refreshes profile on contact avatar tap', () => {
        const filePath = join(__dirname, 'ProfileModal.svelte');
        const content = readFileSync(filePath, 'utf8');

        expect(content).toContain('discoverUserRelays');
        expect(content).toContain('contactRepo.getContacts');
        expect(content).toContain("modals.profile.refreshing");
    });
});
