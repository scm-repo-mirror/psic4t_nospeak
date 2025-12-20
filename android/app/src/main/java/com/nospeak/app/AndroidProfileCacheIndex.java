package com.nospeak.app;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public final class AndroidProfileCacheIndex {

    private AndroidProfileCacheIndex() {
    }

    public static final class PruneResult {

        public final JSONArray index;
        public final List<String> removedPubkeys;

        public PruneResult(JSONArray index, List<String> removedPubkeys) {
            this.index = index;
            this.removedPubkeys = removedPubkeys;
        }
    }

    public static JSONArray upsert(JSONArray index, String pubkeyHex, long updatedAt) {
        List<JSONObject> entries = readEntries(index, pubkeyHex);

        try {
            JSONObject record = new JSONObject();
            record.put("pubkeyHex", pubkeyHex);
            record.put("updatedAt", updatedAt);
            entries.add(record);
        } catch (Exception e) {
            return index != null ? index : new JSONArray();
        }

        sortEntries(entries);

        JSONArray result = new JSONArray();
        for (JSONObject entry : entries) {
            result.put(entry);
        }
        return result;
    }

    public static PruneResult prune(JSONArray index, int maxEntries) {
        List<JSONObject> entries = readEntries(index, null);
        sortEntries(entries);

        JSONArray kept = new JSONArray();
        List<String> removed = new ArrayList<>();

        for (int i = 0; i < entries.size(); i++) {
            JSONObject entry = entries.get(i);
            String pubkeyHex = entry.optString("pubkeyHex", "");
            if (pubkeyHex.isEmpty()) {
                continue;
            }

            if (i < maxEntries) {
                kept.put(entry);
            } else {
                removed.add(pubkeyHex);
            }
        }

        return new PruneResult(kept, removed);
    }

    private static List<JSONObject> readEntries(JSONArray index, String excludePubkeyHex) {
        List<JSONObject> result = new ArrayList<>();
        if (index == null) {
            return result;
        }

        for (int i = 0; i < index.length(); i++) {
            JSONObject entry = index.optJSONObject(i);
            if (entry == null) {
                continue;
            }

            String pubkeyHex = entry.optString("pubkeyHex", "");
            if (pubkeyHex.isEmpty()) {
                continue;
            }

            if (excludePubkeyHex != null && pubkeyHex.equalsIgnoreCase(excludePubkeyHex)) {
                continue;
            }

            long updatedAt = entry.optLong("updatedAt", 0L);
            try {
                JSONObject normalized = new JSONObject();
                normalized.put("pubkeyHex", pubkeyHex);
                normalized.put("updatedAt", updatedAt);
                result.add(normalized);
            } catch (Exception ignored) {
                // ignore
            }
        }

        return result;
    }

    private static void sortEntries(List<JSONObject> entries) {
        Collections.sort(entries, new Comparator<JSONObject>() {
            @Override
            public int compare(JSONObject a, JSONObject b) {
                long aUpdatedAt = a.optLong("updatedAt", 0L);
                long bUpdatedAt = b.optLong("updatedAt", 0L);

                if (aUpdatedAt != bUpdatedAt) {
                    return Long.compare(bUpdatedAt, aUpdatedAt);
                }

                String aKey = a.optString("pubkeyHex", "");
                String bKey = b.optString("pubkeyHex", "");
                return aKey.compareToIgnoreCase(bKey);
            }
        });
    }
}
