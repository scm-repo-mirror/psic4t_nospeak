import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getImageMetadata, getVideoMetadata } from './mediaMetadata';

// Mock blurhash encode
vi.mock('blurhash', () => ({
    encode: vi.fn(() => 'LEHV6nWB2yk8pyo0adR*.7kCMdnj')
}));

describe('getImageMetadata', () => {
    let mockCanvas: any;
    let mockCtx: any;
    let mockImageData: any;

    beforeEach(() => {
        mockImageData = {
            data: new Uint8ClampedArray(32 * 32 * 4)
        };
        mockCtx = {
            drawImage: vi.fn(),
            getImageData: vi.fn(() => mockImageData)
        };
        mockCanvas = {
            width: 0,
            height: 0,
            getContext: vi.fn(() => mockCtx)
        };
        vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
            if (tag === 'canvas') return mockCanvas as any;
            if (tag === 'video') {
                const video: any = {
                    preload: '',
                    muted: false,
                    playsInline: false,
                    videoWidth: 1280,
                    videoHeight: 720,
                    src: '',
                    currentTime: 0,
                    onloadeddata: null,
                    onerror: null
                };
                // Simulate loadeddata after src is set
                Object.defineProperty(video, 'src', {
                    set(val: string) {
                        video._src = val;
                    },
                    get() { return video._src; }
                });
                Object.defineProperty(video, 'currentTime', {
                    set() {
                        // Trigger loadeddata when seeking
                        setTimeout(() => video.onloadeddata?.(), 0);
                    },
                    get() { return 0; }
                });
                return video;
            }
            return {} as any;
        });

        // Mock URL.createObjectURL / revokeObjectURL
        vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-url');
        vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

        // Mock Image constructor
        vi.stubGlobal('Image', class MockImage {
            width = 1920;
            height = 1080;
            onload: (() => void) | null = null;
            onerror: (() => void) | null = null;
            set src(_val: string) {
                setTimeout(() => this.onload?.(), 0);
            }
        });
    });

    it('returns correct dimensions and blurhash for an image', async () => {
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const result = await getImageMetadata(file);

        expect(result.width).toBe(1920);
        expect(result.height).toBe(1080);
        expect(result.blurhash).toBe('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
    });

    it('draws image to 32x32 canvas for encoding', async () => {
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        await getImageMetadata(file);

        expect(mockCanvas.width).toBe(32);
        expect(mockCanvas.height).toBe(32);
        expect(mockCtx.drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 32, 32);
        expect(mockCtx.getImageData).toHaveBeenCalledWith(0, 0, 32, 32);
    });

    it('revokes object URL after extraction', async () => {
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        await getImageMetadata(file);

        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url');
    });

    it('throws when canvas context is unavailable', async () => {
        mockCanvas.getContext = vi.fn(() => null);
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

        await expect(getImageMetadata(file)).rejects.toThrow('Canvas 2D context unavailable');
    });

    it('throws when image fails to load', async () => {
        vi.stubGlobal('Image', class MockImage {
            onload: (() => void) | null = null;
            onerror: (() => void) | null = null;
            set src(_val: string) {
                setTimeout(() => this.onerror?.(), 0);
            }
        });

        const file = new File(['test'], 'bad.jpg', { type: 'image/jpeg' });
        await expect(getImageMetadata(file)).rejects.toThrow('Failed to load image');
    });
});

describe('getVideoMetadata', () => {
    let mockCanvas: any;
    let mockCtx: any;
    let mockImageData: any;

    beforeEach(() => {
        mockImageData = {
            data: new Uint8ClampedArray(32 * 32 * 4)
        };
        mockCtx = {
            drawImage: vi.fn(),
            getImageData: vi.fn(() => mockImageData)
        };
        mockCanvas = {
            width: 0,
            height: 0,
            getContext: vi.fn(() => mockCtx)
        };
        vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
            if (tag === 'canvas') return mockCanvas as any;
            if (tag === 'video') {
                const video: any = {
                    preload: '',
                    muted: false,
                    playsInline: false,
                    videoWidth: 1280,
                    videoHeight: 720,
                    _src: '',
                    _currentTime: 0,
                    onloadeddata: null as (() => void) | null,
                    onerror: null as (() => void) | null
                };
                Object.defineProperty(video, 'src', {
                    set(val: string) {
                        video._src = val;
                    },
                    get() { return video._src; }
                });
                Object.defineProperty(video, 'currentTime', {
                    set(_val: number) {
                        setTimeout(() => video.onloadeddata?.(), 0);
                    },
                    get() { return 0; }
                });
                return video;
            }
            return {} as any;
        });

        vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-video-url');
        vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    });

    it('returns correct dimensions and blurhash for a video', async () => {
        const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
        const result = await getVideoMetadata(file);

        expect(result.width).toBe(1280);
        expect(result.height).toBe(720);
        expect(result.blurhash).toBe('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
    });

    it('draws video first frame to 32x32 canvas', async () => {
        const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
        await getVideoMetadata(file);

        expect(mockCanvas.width).toBe(32);
        expect(mockCanvas.height).toBe(32);
        expect(mockCtx.drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 32, 32);
    });

    it('revokes object URL after extraction', async () => {
        const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
        await getVideoMetadata(file);

        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-video-url');
    });

    it('throws when video fails to load', async () => {
        vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
            if (tag === 'canvas') return mockCanvas as any;
            if (tag === 'video') {
                const video: any = {
                    preload: '',
                    muted: false,
                    playsInline: false,
                    _src: '',
                    onloadeddata: null as (() => void) | null,
                    onerror: null as (() => void) | null
                };
                Object.defineProperty(video, 'src', {
                    set(val: string) {
                        video._src = val;
                    },
                    get() { return video._src; }
                });
                Object.defineProperty(video, 'currentTime', {
                    set() {
                        setTimeout(() => video.onerror?.(), 0);
                    },
                    get() { return 0; }
                });
                return video;
            }
            return {} as any;
        });

        const file = new File(['test'], 'bad.mp4', { type: 'video/mp4' });
        await expect(getVideoMetadata(file)).rejects.toThrow('Failed to load video');
    });
});
