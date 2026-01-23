package com.nospeak.app;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;

/**
 * Generates deterministic identicon bitmaps from a seed string.
 * Produces the same visual output as the JS minidenticons library
 * combined with the pastel background from identicon.ts.
 */
public final class IdenticonGenerator {

    private static final int COLORS_NB = 9;
    private static final int DEFAULT_SATURATION = 95;
    private static final int DEFAULT_LIGHTNESS = 45;
    private static final int MAGIC_NUMBER = 5;

    // Pastel background parameters (matching identicon.ts seedToHue)
    private static final int BG_SATURATION = 80;
    private static final int BG_LIGHTNESS = 85;

    // The minidenticons viewBox is -1.5 -1.5 8 8, grid cells are 1x1 at positions 0-4
    private static final float VIEWBOX_X = -1.5f;
    private static final float VIEWBOX_Y = -1.5f;
    private static final float VIEWBOX_SIZE = 8.0f;

    private IdenticonGenerator() {
    }

    /**
     * Generates a square identicon bitmap with a pastel background.
     *
     * @param seed   The seed string (last 10 chars of the npub)
     * @param sizePx The output bitmap size in pixels (width and height)
     * @return A Bitmap containing the identicon
     */
    public static Bitmap generate(String seed, int sizePx) {
        if (seed == null || seed.isEmpty() || sizePx <= 0) {
            return null;
        }

        int hash = simpleHash(seed);

        // Foreground color: matching minidenticons defaults
        int fgHue = ((hash % COLORS_NB) + COLORS_NB) % COLORS_NB * (360 / COLORS_NB);
        int fgColor = hslToRgb(fgHue, DEFAULT_SATURATION, DEFAULT_LIGHTNESS);

        // Background color: matching identicon.ts seedToHue
        int bgHue = seedToHue(seed);
        int bgColor = hslToRgb(bgHue, BG_SATURATION, BG_LIGHTNESS);

        Bitmap bitmap = Bitmap.createBitmap(sizePx, sizePx, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);

        // Scale factor: map viewBox coordinates to pixel coordinates
        float scale = sizePx / VIEWBOX_SIZE;

        // Draw pastel background (fills entire bitmap)
        Paint bgPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        bgPaint.setColor(bgColor);
        bgPaint.setStyle(Paint.Style.FILL);
        canvas.drawRect(0, 0, sizePx, sizePx, bgPaint);

        // Draw identicon cells
        Paint fgPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        fgPaint.setColor(fgColor);
        fgPaint.setStyle(Paint.Style.FILL);

        for (int i = 0; i < 25; i++) {
            // Test the 15 lowest weight bits of the hash
            if ((hash & (1 << (i % 15))) != 0) {
                int x;
                int y = i % 5;

                if (i > 14) {
                    // Mirrored column
                    x = 7 - (i / 5);
                } else {
                    x = i / 5;
                }

                // Convert viewBox coordinates to pixel coordinates
                float left = (x - VIEWBOX_X) * scale;
                float top = (y - VIEWBOX_Y) * scale;
                float right = left + scale;
                float bottom = top + scale;

                canvas.drawRect(left, top, right, bottom, fgPaint);
            }
        }

        return bitmap;
    }

    /**
     * Exact port of minidenticons' simpleHash function.
     * Uses XOR and multiply by -MAGIC_NUMBER, then unsigned right shift by 2.
     */
    private static int simpleHash(String str) {
        int hash = MAGIC_NUMBER;
        for (int i = 0; i < str.length(); i++) {
            hash = (hash ^ str.charAt(i)) * -MAGIC_NUMBER;
        }
        return hash >>> 2; // unsigned right shift for 32-bit unsigned integer
    }

    /**
     * Matching identicon.ts seedToHue function.
     * Produces a hue value (0-359) from the seed string.
     */
    private static int seedToHue(String seed) {
        int hash = 0;
        for (int i = 0; i < seed.length(); i++) {
            hash = seed.charAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash) % 360;
    }

    /**
     * Converts HSL color values to an ARGB integer.
     *
     * @param h Hue (0-360)
     * @param s Saturation (0-100)
     * @param l Lightness (0-100)
     * @return ARGB color integer
     */
    private static int hslToRgb(int h, int s, int l) {
        float hf = h / 360.0f;
        float sf = s / 100.0f;
        float lf = l / 100.0f;

        float r, g, b;

        if (sf == 0) {
            r = g = b = lf;
        } else {
            float q = lf < 0.5f ? lf * (1 + sf) : lf + sf - lf * sf;
            float p = 2 * lf - q;
            r = hueToRgb(p, q, hf + 1.0f / 3.0f);
            g = hueToRgb(p, q, hf);
            b = hueToRgb(p, q, hf - 1.0f / 3.0f);
        }

        return Color.argb(255, Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
    }

    private static float hueToRgb(float p, float q, float t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1.0f / 6.0f) return p + (q - p) * 6 * t;
        if (t < 1.0f / 2.0f) return q;
        if (t < 2.0f / 3.0f) return p + (q - p) * (2.0f / 3.0f - t) * 6;
        return p;
    }
}
