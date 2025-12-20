# Design: Cached contact identity for Android background notifications

## Summary
When Android Background Messaging is enabled, the native foreground service is responsible for emitting message/reaction notifications while the WebView is suspended. The service already decrypts activity (Amber-only) and can group notifications per conversation, but it cannot access the web runtime's IndexedDB profile cache.

This change introduces a small, bounded SharedPreferences cache that the web runtime populates with identity derived from Nostr kind `0` metadata. The native service reads this cache to render more informative notifications.

## Architecture

### Data flow
1. Web runtime resolves a profile from relays (already required for contacts and chat).
2. Web runtime parses kind `0` metadata and stores it in its own DB.
3. On Android only, the web runtime pushes a subset of that metadata to native storage via a Capacitor plugin call:
    - `pubkeyHex`
    - `username` = kind `0.name`
    - `pictureUrl` = kind `0.picture`
    - `updatedAt`
4. Native foreground service receives a new gift-wrap, decrypts it, derives `partnerPubkeyHex`, and builds a notification.
5. The service looks up cached identity by `partnerPubkeyHex`:
    - If `username` exists: use it as notification title.
    - Otherwise: use the existing generic title.
6. If `pictureUrl` is present, the service downloads an avatar bitmap (best-effort), caches it, and updates the existing notification entry with a large icon.

### Key constraints
- The native service MUST NOT subscribe to Nostr kind `0` events.
- The notification title MUST use `kind 0.name` only (no `display_name`).
- The cache MUST only store entries when `kind 0.name` is non-empty.
- Cache MUST be bounded to 100 contacts.

## Storage model
- Android SharedPreferences store holds:
    - Per-contact record keyed by `pubkeyHex`.
    - A small index (ordered by `updatedAt`) to support pruning to 100 entries.
- Record schema:
    - `username: string` (required; non-empty)
    - `pictureUrl: string | null` (optional)
    - `updatedAt: number` (ms epoch)

## Avatar download and caching
- Best-effort and non-blocking:
    - Notifications should be emitted immediately with title/body even if avatar is not yet available.
    - When avatar download finishes, the service updates the same notification id so the notification entry upgrades in place.
- Limits:
    - Deduplicate in-flight fetches per `pubkeyHex`.
    - Scale down decoded bitmaps to an appropriate notification icon size.
    - Use disk cache under the app cache directory for re-use across service restarts.

## Failure handling
- If cache lookup fails or record missing: keep existing behavior.
- If avatar download fails: keep existing behavior.
- If the Capacitor plugin call fails: web runtime continues to function; notifications remain generic.

## Privacy considerations
- This change does not modify the preview body behavior.
- Avatar URLs are fetched only when notifications are eligible to be shown (best-effort gating), and images are stored only in app-private cache.

## Alternatives considered
- Native kind `0` relay subscription: rejected by request.
- Reading the web runtime IndexedDB from native: not portable and not reliable for a background Service.
