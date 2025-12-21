export function extractYouTubeVideoId(url: string): string | null {
    let parsed: URL;

    try {
        parsed = new URL(url);
    } catch {
        return null;
    }

    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;

    let candidate: string | null = null;

    if (host === 'youtu.be' || host.endsWith('.youtu.be')) {
        const segments = pathname.split('/').filter(Boolean);
        candidate = segments[0] ?? null;
    } else if (
        host === 'youtube.com' ||
        host.endsWith('.youtube.com') ||
        host === 'm.youtube.com' ||
        host === 'music.youtube.com'
    ) {
        if (pathname === '/watch') {
            candidate = parsed.searchParams.get('v');
        } else if (pathname.startsWith('/shorts/')) {
            const parts = pathname.split('/').filter(Boolean);
            candidate = parts[1] ?? null;
        } else if (pathname.startsWith('/embed/')) {
            const parts = pathname.split('/').filter(Boolean);
            candidate = parts[1] ?? null;
        }
    }

    if (!candidate) {
        return null;
    }

    const cleaned = candidate.split('?')[0]?.split('&')[0]?.trim() ?? '';

    if (!/^[a-zA-Z0-9_-]{11}$/.test(cleaned)) {
        return null;
    }

    return cleaned;
}

export function isYouTubeUrl(url: string): boolean {
    return extractYouTubeVideoId(url) !== null;
}
