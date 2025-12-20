package com.nospeak.app;

import org.json.JSONArray;

import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class AndroidProfileCacheIndexTest {

    @Test
    public void pruneKeepsNewestHundredEntries() {
        JSONArray index = new JSONArray();

        for (int i = 0; i < 101; i++) {
            index = AndroidProfileCacheIndex.upsert(index, "pubkey" + i, i);
        }

        AndroidProfileCacheIndex.PruneResult result = AndroidProfileCacheIndex.prune(index, 100);
        assertEquals(100, result.index.length());

        List<String> removed = result.removedPubkeys;
        assertEquals(1, removed.size());
        assertEquals("pubkey0", removed.get(0));

        assertEquals("pubkey100", result.index.optJSONObject(0).optString("pubkeyHex"));
        assertEquals("pubkey1", result.index.optJSONObject(99).optString("pubkeyHex"));
    }

    @Test
    public void upsertReplacesExistingEntry() {
        JSONArray index = new JSONArray();

        index = AndroidProfileCacheIndex.upsert(index, "pubkeyA", 1);
        index = AndroidProfileCacheIndex.upsert(index, "pubkeyB", 2);
        index = AndroidProfileCacheIndex.upsert(index, "pubkeyA", 5);

        assertEquals(2, index.length());
        assertEquals("pubkeyA", index.optJSONObject(0).optString("pubkeyHex"));
        assertTrue(index.toString().contains("\"updatedAt\":5"));
    }
}
