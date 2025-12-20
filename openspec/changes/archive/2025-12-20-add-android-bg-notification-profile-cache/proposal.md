# Change: Add cached contact identity to Android background notifications

## Why
Android Background Messaging has become reliable, but notifications raised by the native foreground service still use a generic title (for example, "New activity") and do not show a contact avatar. This makes notifications harder to act on and less consistent with the in-app contact list.

## What Changes
- Add a small Android-native profile cache (SharedPreferences) that stores per-contact identity derived from Nostr kind `0` metadata.
- Extend the existing Android Background Messaging Capacitor plugin so the web runtime can push cached contact identity into SharedPreferences.
- Update the native Android background messaging foreground service to:
    - Use cached `kind 0.name` (username) as the notification title when available.
    - Download and display the cached `kind 0.picture` URL as the notification large icon (best-effort, non-blocking).
    - Fall back to the existing generic title when no cached username is available.

## Scope / Constraints
- **Amber-only**: this change does not expand background notification support beyond the current Amber-only behavior.
- **No kind `0` relay subscriptions in native service**: the native foreground service MUST NOT subscribe to kind `0` metadata events. It relies solely on locally cached metadata provided by the web runtime.
- **Username-only**: the notification title MUST use `kind 0.name` (username) only. It MUST NOT use `display_name` or other display-name fields.
- **Non-empty requirement**: the cache MUST only store identity records when `kind 0.name` is non-empty.
- The cache MUST be bounded to a small size (maximum 100 contacts) and pruned deterministically.

## Impact
- Affected specs:
    - `android-app-shell`
    - `messaging`
- Affected code (implementation stage):
    - Android native: `NativeBackgroundMessagingService`, `AndroidBackgroundMessagingPlugin`
    - Web runtime: `ProfileResolver` (or equivalent profile refresh path)

## Risks / Trade-offs
- Names/avatars will only appear for contacts whose kind `0` metadata has already been fetched by the web runtime on that device. After a fresh install or before the user has opened/resolved a contact profile, notifications may still show the generic title.
- Avatar downloads add background network activity. The implementation must dedupe, cache, and scale images to keep memory and bandwidth impact low.

## Non-Goals
- Do not change JS-driven notifications (web runtime path) naming rules.
- Do not introduce native kind `0` subscriptions.
- Do not add a new alias system or contact nickname feature.
- Do not change notification privacy behavior (message previews remain as currently specified).
