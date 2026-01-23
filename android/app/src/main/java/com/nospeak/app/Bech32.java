package com.nospeak.app;

/**
 * Minimal Bech32 encoder for converting a 32-byte hex pubkey to an npub string.
 * Implements only the subset needed for NIP-19 npub encoding.
 */
public final class Bech32 {

    private static final String CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
    private static final String NPUB_HRP = "npub";

    private Bech32() {
    }

    /**
     * Converts a 32-byte hex-encoded public key to a bech32-encoded npub string.
     *
     * @param pubkeyHex 64-character hex string representing a 32-byte public key
     * @return bech32-encoded npub string, or null if input is invalid
     */
    public static String pubkeyHexToNpub(String pubkeyHex) {
        if (pubkeyHex == null || pubkeyHex.length() != 64) {
            return null;
        }

        byte[] data;
        try {
            data = hexToBytes(pubkeyHex);
        } catch (IllegalArgumentException e) {
            return null;
        }

        int[] words = convertBits(data, 8, 5);
        if (words == null) {
            return null;
        }

        return encode(NPUB_HRP, words);
    }

    private static String encode(String hrp, int[] data) {
        int[] checksum = createChecksum(hrp, data);
        StringBuilder sb = new StringBuilder(hrp.length() + 1 + data.length + checksum.length);
        sb.append(hrp);
        sb.append('1');
        for (int d : data) {
            sb.append(CHARSET.charAt(d));
        }
        for (int c : checksum) {
            sb.append(CHARSET.charAt(c));
        }
        return sb.toString();
    }

    private static int[] createChecksum(String hrp, int[] data) {
        int[] values = new int[hrpExpand(hrp).length + data.length + 6];
        int[] hrpExpanded = hrpExpand(hrp);
        System.arraycopy(hrpExpanded, 0, values, 0, hrpExpanded.length);
        System.arraycopy(data, 0, values, hrpExpanded.length, data.length);
        // Last 6 are already 0
        int polymod = polymod(values) ^ 1;
        int[] checksum = new int[6];
        for (int i = 0; i < 6; i++) {
            checksum[i] = (polymod >>> (5 * (5 - i))) & 31;
        }
        return checksum;
    }

    private static int[] hrpExpand(String hrp) {
        int[] result = new int[hrp.length() * 2 + 1];
        for (int i = 0; i < hrp.length(); i++) {
            result[i] = hrp.charAt(i) >>> 5;
        }
        result[hrp.length()] = 0;
        for (int i = 0; i < hrp.length(); i++) {
            result[hrp.length() + 1 + i] = hrp.charAt(i) & 31;
        }
        return result;
    }

    private static int polymod(int[] values) {
        int chk = 1;
        int[] gen = {0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3};
        for (int v : values) {
            int b = chk >>> 25;
            chk = ((chk & 0x1ffffff) << 5) ^ v;
            for (int i = 0; i < 5; i++) {
                if (((b >>> i) & 1) == 1) {
                    chk ^= gen[i];
                }
            }
        }
        return chk;
    }

    /**
     * Converts data between bit groups (e.g., 8-bit bytes to 5-bit words).
     */
    private static int[] convertBits(byte[] data, int fromBits, int toBits) {
        int acc = 0;
        int bits = 0;
        int maxv = (1 << toBits) - 1;
        int[] result = new int[(data.length * fromBits + toBits - 1) / toBits];
        int idx = 0;
        for (byte b : data) {
            acc = (acc << fromBits) | (b & 0xff);
            bits += fromBits;
            while (bits >= toBits) {
                bits -= toBits;
                result[idx++] = (acc >>> bits) & maxv;
            }
        }
        if (bits > 0) {
            result[idx++] = (acc << (toBits - bits)) & maxv;
        }
        // Trim to actual size
        int[] trimmed = new int[idx];
        System.arraycopy(result, 0, trimmed, 0, idx);
        return trimmed;
    }

    private static byte[] hexToBytes(String hex) {
        int len = hex.length();
        byte[] bytes = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            int hi = Character.digit(hex.charAt(i), 16);
            int lo = Character.digit(hex.charAt(i + 1), 16);
            if (hi == -1 || lo == -1) {
                throw new IllegalArgumentException("Invalid hex character");
            }
            bytes[i / 2] = (byte) ((hi << 4) | lo);
        }
        return bytes;
    }
}
