export function getDisplayedNip05(raw: string): string {
    const value = (raw || '').trim();
    if (!value) {
        return '';
    }

    const match = value.match(/^_@(.+)$/);
    if (match) {
        return match[1];
    }

    return value;
}
