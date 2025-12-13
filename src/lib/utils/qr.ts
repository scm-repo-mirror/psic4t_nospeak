import jsQR from 'jsqr';

export function decodeQrFromImageData(imageData: ImageData): string | null {
    const { data, width, height } = imageData;

    if (!width || !height) {
        return null;
    }

    const result = jsQR(data, width, height);
    return result ? result.data || null : null;
}

export function parseNpubFromQrPayload(raw: string): string | null {
    let text = raw.trim();

    if (!text) {
        return null;
    }

    if (text.toLowerCase().startsWith('nostr:')) {
        text = text.slice('nostr:'.length);
    }

    if (text.startsWith('npub1')) {
        return text;
    }

    return null;
}
