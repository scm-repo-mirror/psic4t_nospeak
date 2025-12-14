export interface EncryptedFileResult {
    ciphertext: Uint8Array;
    key: string; // base64url-encoded AES-GCM key
    nonce: string; // base64url-encoded AES-GCM nonce
    size: number; // ciphertext byte length
    hashEncrypted: string; // hex-encoded SHA-256 of ciphertext
    hashPlain?: string; // optional hex-encoded SHA-256 of original file bytes
}

function getSubtle(): SubtleCrypto {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        return window.crypto.subtle;
    }
    throw new Error('WebCrypto SubtleCrypto is not available in this environment');
}

function toBase64Url(bytes: Uint8Array): string {
    if (typeof Buffer !== 'undefined') {
        const b64 = Buffer.from(bytes).toString('base64');
        return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    // Browser fallback
    const binary = String.fromCharCode(...bytes);
    const b64 = btoa(binary);
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(input: string): Uint8Array {
    const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
    if (typeof Buffer !== 'undefined') {
        return new Uint8Array(Buffer.from(b64, 'base64'));
    }
    const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
    const binary = atob(b64 + pad);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

function toHex(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

async function sha256Hex(data: Uint8Array): Promise<string> {
    const subtle = getSubtle();
    const hashBuffer = await subtle.digest('SHA-256', data.buffer as ArrayBuffer);
    return toHex(new Uint8Array(hashBuffer as ArrayBuffer));
}

export async function encryptFileWithAesGcm(file: File): Promise<EncryptedFileResult> {
    const subtle = getSubtle();

    const fileBuffer = new Uint8Array(await file.arrayBuffer());

    const key = await subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    const rawKeyBuffer = await subtle.exportKey('raw', key) as ArrayBuffer;
    const rawKey = new Uint8Array(rawKeyBuffer);
    const nonceBytes = new Uint8Array(12);
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(nonceBytes);
    } else if (typeof crypto !== 'undefined' && (crypto as any).getRandomValues) {
        (crypto as any).getRandomValues(nonceBytes);
    } else {
        throw new Error('No secure random source available for AES-GCM nonce');
    }

    const encryptedBuffer = await subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: nonceBytes
        },
        key,
        fileBuffer.buffer as ArrayBuffer
    );
    const ciphertextBuffer = new Uint8Array(encryptedBuffer as ArrayBuffer);

    const hashEncrypted = await sha256Hex(ciphertextBuffer);
    const hashPlain = await sha256Hex(fileBuffer);

    return {
        ciphertext: ciphertextBuffer,
        key: toBase64Url(rawKey),
        nonce: toBase64Url(nonceBytes),
        size: ciphertextBuffer.byteLength,
        hashEncrypted,
        hashPlain
    };
}

export async function decryptAesGcmToBytes(
    ciphertext: Uint8Array,
    keyB64Url: string,
    nonceB64Url: string
): Promise<Uint8Array> {
    const subtle = getSubtle();

    const keyBytes = fromBase64Url(keyB64Url);
    const nonceBytes = fromBase64Url(nonceB64Url);

    const key = await subtle.importKey(
        'raw',
        keyBytes.buffer as ArrayBuffer,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
    );

    const decryptedBuffer = await subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: nonceBytes as any
        },
        key,
        ciphertext as any
    );

    return new Uint8Array(decryptedBuffer as ArrayBuffer);
}
