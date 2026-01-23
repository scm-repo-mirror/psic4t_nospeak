import { minidenticon } from 'minidenticons';

/**
 * Derives a deterministic hue (0-360) from a seed string.
 */
function seedToHue(seed: string): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 360;
}

/**
 * Generates a deterministic identicon SVG data URI from the last 10 characters of an npub,
 * with a bright pastel background color derived from the same seed.
 */
export function getIdenticonDataUri(npub: string): string {
    const seed = npub.slice(-10);
    const svg = minidenticon(seed);
    const hue = seedToHue(seed);
    const bgColor = `hsl(${hue},80%,85%)`;

    // Inject a background rect matching the viewBox (-1.5 -1.5 8 8)
    const svgWithBg = svg.replace('>', `><rect x="-1.5" y="-1.5" width="8" height="8" fill="${bgColor}"/>`);

    return `data:image/svg+xml;utf8,${encodeURIComponent(svgWithBg)}`;
}
