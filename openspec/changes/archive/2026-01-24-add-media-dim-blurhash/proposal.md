# Change: Add dimension and blurhash metadata to Kind 15 file messages

## Why
Media messages (images and videos) cause layout jumps when they load lazily because the message bubble has no pre-set dimensions. Adding `dim` and `blurhash` tags to Kind 15 file messages allows the UI to reserve the correct aspect-ratio space and display a blurred placeholder while the encrypted media decrypts and loads.

## What Changes
- Extract image/video dimensions and compute a blurhash before sending Kind 15 file messages
- Include NIP-94 compatible `dim` and `blurhash` tags in Kind 15 event tags
- Store `fileWidth`, `fileHeight`, and `fileBlurhash` in the local Message database record
- Parse `dim` and `blurhash` tags when receiving Kind 15 messages from any client
- Render a blurhash canvas placeholder with correct aspect-ratio in the media bubble while the real media loads
- Add `blurhash` npm dependency for encoding/decoding

## Impact
- Affected specs: `messaging` (NIP-17 Kind 15 File Messages, File Message Metadata for Interoperability)
- Affected code:
  - `src/lib/db/db.ts` (Message interface)
  - `src/lib/core/Messaging.ts` (send/receive tag handling)
  - `src/lib/components/ChatView.svelte` (dimension extraction before send)
  - `src/lib/components/MessageContent.svelte` (blurhash placeholder rendering)
  - New utility: `src/lib/utils/mediaMetadata.ts` (dimension + blurhash extraction helpers)
  - `package.json` (new `blurhash` dependency)
