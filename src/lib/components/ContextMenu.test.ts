import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('ContextMenu outside press handling', () => {
    it('closes on pointerdown without delayed click gating', () => {
        const filePath = join(__dirname, 'ContextMenu.svelte');
        const content = readFileSync(filePath, 'utf8');

        expect(content).toContain("addEventListener('pointerdown'");
        expect(content).toContain("removeEventListener('pointerdown'");

        // Prevent regression to the previous "two clicks to close" behavior.
        expect(content).not.toContain('isMenuJustOpened');
        expect(content).not.toContain("addEventListener('click'");
    });
});
