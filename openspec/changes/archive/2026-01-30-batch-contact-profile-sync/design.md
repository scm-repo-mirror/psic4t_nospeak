## Context

The current sync flow fetches contacts from Kind 30000 but doesn't resolve their profiles. Profile resolution only happens for contacts that exchange messages (via `autoAddContact` in `Messaging.ts`). This leaves contacts without recent message activity showing as truncated npubs.

Current architecture:
- `ProfileResolver.resolveProfile(npub)` fetches one profile at a time with a 3-second timeout
- `ConnectionManager.subscribe()` supports multi-author filters in a single request
- Nostr relays efficiently handle `authors: [pk1, pk2, ...]` filters

## Goals / Non-Goals

**Goals:**
- Resolve profiles for all contacts fetched from Kind 30000 during sync
- Use batch fetching for efficiency (single relay request for multiple authors)
- Integrate seamlessly into existing sync flow without adding new UI steps

**Non-Goals:**
- Changing the sync step UI (use existing "Fetch contacts" step)
- Implementing profile caching strategy changes
- Handling contacts with no profile on any relay (accept that some will remain as npubs)

## Decisions

### 1. Add `resolveProfilesBatch()` method to ProfileResolver

Create a new method that takes an array of npubs and fetches all their profiles in a single relay subscription using a multi-author filter.

```typescript
async resolveProfilesBatch(npubs: string[]): Promise<void>
```

**Rationale:** Batch fetching is significantly faster than individual requests:
- Single relay round-trip vs N round-trips
- Single 5-second timeout vs N × 3-second timeouts
- Reduces relay load

**Alternatives considered:**
- Parallel individual resolution (`Promise.all` with existing method): Still creates N subscriptions, slower, more relay load. Rejected.
- Sequential individual resolution: Too slow for users with many contacts. Rejected.

### 2. Process events by npub during batch fetch

As events arrive, look up the npub from the pubkey and accumulate profile data per-npub. Cache each profile as soon as we have all required data for it (Kind 0 at minimum).

**Rationale:** Allows early caching of profiles that resolve quickly while waiting for others. The existing timeout handles stragglers.

### 3. Use 5-second timeout for batch resolution

Slightly longer than individual resolution (3s) to account for more data being fetched.

**Rationale:** Balance between giving relays time to respond for all authors and not blocking sync too long.

**Alternatives considered:**
- Keep 3s timeout: May be too short for 20+ authors. Rejected.
- 10s timeout: Too long, delays user experience. Rejected.

### 4. Call batch resolution from ContactSyncService after merge

After `fetchAndMergeContacts()` adds new contacts from Kind 30000, call `resolveProfilesBatch()` for all newly added npubs.

**Rationale:** Natural integration point - we know exactly which contacts are new and need resolution.

### 5. Import profileResolver into ContactSyncService

Add the import and call batch resolution after the merge loop completes.

**Rationale:** Keeps batch resolution logic in ProfileResolver where it belongs. ContactSyncService only orchestrates the call.

## Risks / Trade-offs

- **Large contact lists**: Users with 100+ contacts may still experience slow profile resolution. Mitigation: Accept partial success - profiles that don't resolve in 5s will show as npubs until manually refreshed.

- **Relay response size**: Multi-author filters may return large amounts of data. Mitigation: Nostr relays are designed for this; the limit in the filter prevents excessive data.

- **Duplicate resolution**: Some contacts may get resolved twice (once in batch, once via `autoAddContact` during history fetch). Mitigation: `ProfileResolver` already handles this via cache checks - minimal overhead.
