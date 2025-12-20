package com.nospeak.app;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public final class AndroidProfileCachePrefs {

    private static final String PREFS_NAME = "nospeak_profile_cache";
    private static final String KEY_INDEX_JSON = "indexJson";

    private static final int MAX_ENTRIES = 100;

    private AndroidProfileCachePrefs() {
    }

    public static final class Identity {

        public final String username;
        public final String pictureUrl;

        public Identity(String username, String pictureUrl) {
            this.username = username;
            this.pictureUrl = pictureUrl;
        }
    }

    public static void upsert(Context context, String pubkeyHex, String username, String pictureUrl, long updatedAt) {
        if (context == null) {
            return;
        }

        if (pubkeyHex == null || pubkeyHex.isEmpty()) {
            return;
        }

        if (username == null || username.trim().isEmpty()) {
            return;
        }

        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();

        JSONObject record;
        try {
            record = new JSONObject();
            record.put("username", username.trim());
            if (pictureUrl != null && !pictureUrl.trim().isEmpty()) {
                record.put("pictureUrl", pictureUrl.trim());
            }
            record.put("updatedAt", updatedAt);
        } catch (Exception e) {
            return;
        }

        editor.putString(profileKey(pubkeyHex), record.toString());

        JSONArray index = readIndex(prefs);
        JSONArray updatedIndex = AndroidProfileCacheIndex.upsert(index, pubkeyHex, updatedAt);
        AndroidProfileCacheIndex.PruneResult pruned = AndroidProfileCacheIndex.prune(updatedIndex, MAX_ENTRIES);

        for (String removedPubkeyHex : pruned.removedPubkeys) {
            editor.remove(profileKey(removedPubkeyHex));
        }

        editor.putString(KEY_INDEX_JSON, pruned.index.toString());
        editor.apply();
    }

    public static Identity get(Context context, String pubkeyHex) {
        if (context == null) {
            return null;
        }

        if (pubkeyHex == null || pubkeyHex.isEmpty()) {
            return null;
        }

        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String raw = prefs.getString(profileKey(pubkeyHex), null);
        if (raw == null || raw.isEmpty()) {
            return null;
        }

        try {
            JSONObject record = new JSONObject(raw);
            String username = record.optString("username", "").trim();
            if (username.isEmpty()) {
                return null;
            }

            String pictureUrl = record.optString("pictureUrl", null);
            if (pictureUrl != null) {
                pictureUrl = pictureUrl.trim();
                if (pictureUrl.isEmpty()) {
                    pictureUrl = null;
                }
            }

            return new Identity(username, pictureUrl);
        } catch (JSONException e) {
            return null;
        }
    }

    private static JSONArray readIndex(SharedPreferences prefs) {
        String raw = prefs.getString(KEY_INDEX_JSON, null);
        if (raw == null || raw.isEmpty()) {
            return new JSONArray();
        }

        try {
            return new JSONArray(raw);
        } catch (JSONException e) {
            return new JSONArray();
        }
    }

    private static String profileKey(String pubkeyHex) {
        return "profile_" + pubkeyHex;
    }
}
