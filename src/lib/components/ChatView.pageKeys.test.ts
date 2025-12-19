import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('ChatView desktop page-key scrolling scope', () => {
    it('makes the message window focusable and activatable', () => {
        const filePath = join(__dirname, 'ChatView.svelte');
        const content = readFileSync(filePath, 'utf8');

        expect(content).toContain('bind:this={chatContainer}');
        expect(content).toContain('tabindex="-1"');
        expect(content).toContain('onpointerdown={activateMessageWindow}');
    });

    it('never intercepts page keys while typing or with modals open', () => {
        const filePath = join(__dirname, 'ChatView.svelte');
        const content = readFileSync(filePath, 'utf8');

        expect(content).toContain('if (!isPageKey(e.key)) return;');
        expect(content).toContain('if (showMediaPreview)');
        expect(content).toContain('document.querySelector(\'[aria-modal="true"]\')');
        expect(content).toContain('if (activeEl === inputElement)');
    });
});
