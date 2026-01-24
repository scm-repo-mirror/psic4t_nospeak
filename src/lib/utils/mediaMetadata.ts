import { encode } from 'blurhash';

export interface MediaMetadata {
    width: number;
    height: number;
    blurhash: string;
}

const ENCODE_WIDTH = 32;
const ENCODE_HEIGHT = 32;
const COMPONENT_X = 4;
const COMPONENT_Y = 3;

/**
 * Extract dimensions and compute blurhash for an image file.
 * Throws on failure so callers can catch and proceed without metadata.
 */
export async function getImageMetadata(file: File): Promise<MediaMetadata> {
    const url = URL.createObjectURL(file);
    try {
        const img = await loadImage(url);
        const { width, height } = img;
        const blurhash = encodeFromImage(img);
        return { width, height, blurhash };
    } finally {
        URL.revokeObjectURL(url);
    }
}

/**
 * Extract dimensions and compute blurhash from the first frame of a video file.
 * Throws on failure so callers can catch and proceed without metadata.
 */
export async function getVideoMetadata(file: File): Promise<MediaMetadata> {
    const url = URL.createObjectURL(file);
    try {
        const video = await loadVideoFirstFrame(url);
        const width = video.videoWidth;
        const height = video.videoHeight;
        const blurhash = encodeFromVideo(video);
        return { width, height, blurhash };
    } finally {
        URL.revokeObjectURL(url);
    }
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = src;
    });
}

function loadVideoFirstFrame(src: string): Promise<HTMLVideoElement> {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;

        video.onloadeddata = () => resolve(video);
        video.onerror = () => reject(new Error('Failed to load video'));

        video.src = src;
        // Seek to the first frame
        video.currentTime = 0.001;
    });
}

function encodeFromImage(img: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    canvas.width = ENCODE_WIDTH;
    canvas.height = ENCODE_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');

    ctx.drawImage(img, 0, 0, ENCODE_WIDTH, ENCODE_HEIGHT);
    const imageData = ctx.getImageData(0, 0, ENCODE_WIDTH, ENCODE_HEIGHT);
    return encode(imageData.data, ENCODE_WIDTH, ENCODE_HEIGHT, COMPONENT_X, COMPONENT_Y);
}

function encodeFromVideo(video: HTMLVideoElement): string {
    const canvas = document.createElement('canvas');
    canvas.width = ENCODE_WIDTH;
    canvas.height = ENCODE_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');

    ctx.drawImage(video, 0, 0, ENCODE_WIDTH, ENCODE_HEIGHT);
    const imageData = ctx.getImageData(0, 0, ENCODE_WIDTH, ENCODE_HEIGHT);
    return encode(imageData.data, ENCODE_WIDTH, ENCODE_HEIGHT, COMPONENT_X, COMPONENT_Y);
}
