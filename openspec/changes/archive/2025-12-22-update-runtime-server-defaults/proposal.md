# Change: Runtime-configurable Default Servers and Relays

## Why
Nospeak currently embeds several default server/relay endpoints directly in client code (discovery relays, default messaging relays, NIP-50 search relay, blaster relay, default Blossom servers, URL preview base URL for Android, and Robohash base URL). This makes deployments inflexible: operators cannot swap defaults per environment (staging vs production, private relay sets, self-hosted URL preview base) without rebuilding the application.

This change introduces a single runtime (restart-to-apply) configuration surface so deployments can override these defaults using environment variables (for example, via Docker Compose), while preserving the current built-in defaults when no overrides are provided.

## What Changes
- Add a same-origin endpoint `GET /api/runtime-config` that returns the effective defaults.
- Centralize all hardcoded default server/relay lists into a single runtime-configurable config model.
- Allow deployments to override defaults via environment variables read from `process.env` by the running Node server.
- Require strict URL schemes for safety and consistency:
  - Relays MUST use `wss://`.
  - Server base URLs (Blossom, Robohash, and URL-preview base) MUST use `https://`.
- Client boot sequence fetches `/api/runtime-config` once and uses the returned values for all relevant behavior.

## Configuration
The following environment variables are supported (restart-to-apply):

- `NOSPEAK_DISCOVERY_RELAYS` (comma-separated `wss://…` URLs)
- `NOSPEAK_DEFAULT_MESSAGING_RELAYS` (comma-separated `wss://…` URLs)
- `NOSPEAK_SEARCH_RELAY` (`wss://…`)
- `NOSPEAK_BLASTER_RELAY` (`wss://…`)
- `NOSPEAK_DEFAULT_BLOSSOM_SERVERS` (comma-separated `https://…` origins)
- `NOSPEAK_WEB_APP_BASE_URL` (`https://…` origin)
- `NOSPEAK_ROBOHASH_BASE_URL` (`https://…` origin)

`GET /api/runtime-config` always returns a full config object, using built-in defaults when env overrides are absent or invalid.

## Impact
- Affected specs:
  - `messaging`
  - `android-app-shell`
- Affected code (implementation stage):
  - Relay defaults: discovery, empty-profile modal, NIP-50 search helper, publish-to-relays flows
  - Blossom defaults: default Blossom server list and media server publishing
  - Android URL preview: base URL selection
  - Notification avatars: Robohash base URL
  - App bootstrap: initialize runtime config early

## Out of Scope
- No support for runtime config changes without restarting the Node server/container.
- No attempt to make Android static builds fully runtime-configurable (since they do not ship with a Node server); they will continue to use built-in defaults and any build-time configuration already supported.
- No migration work to remove deprecated legacy internal media origins.
