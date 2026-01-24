## Context
Kind 15 file messages currently carry no dimension or placeholder metadata. When media loads lazily (via IntersectionObserver + AES-GCM decryption), the message bubble starts at zero height and expands when the media renders, causing layout shift (CLS) that makes the chat list jump.

The `blurhash` library provides a compact string encoding (~20-30 chars) of a blurred image placeholder that can be decoded to pixel data and rendered on a canvas instantly.

## Goals / Non-Goals
- Goals:
  - Eliminate layout shift for media messages sent by nospeak clients
  - Display a visually pleasant blurhash placeholder while media decrypts/loads
  - Use NIP-94 compatible tag format (`dim`, `blurhash`) for interoperability
  - Support both images and videos (first frame for video blurhash)

- Non-Goals:
  - Adding `thumb`, `imeta`, or other NIP-94 tags (out of scope)
  - Generating fallback dimensions for received messages that lack `dim` tags
  - Server-side thumbnail generation

## Decisions

### Dimension extraction location: UI layer
- **Decision**: Extract dimensions in the UI layer (ChatView.svelte) before calling `sendFileMessage`/`sendGroupFileMessage`, passing `width`, `height`, and `blurhash` as parameters.
- **Rationale**: Keeps `Messaging.ts` focused on protocol concerns. The UI already has access to the File object and can create Image/Video elements for measurement.
- **Alternatives considered**: Extracting inside `Messaging.ts` — rejected because it introduces browser DOM APIs into the core messaging layer.

### Blurhash encoding parameters
- **Decision**: Encode at componentX=4, componentY=3 using a 32x32 downscaled canvas.
- **Rationale**: Produces a ~20-30 character string (small tag payload) with visually adequate blur quality. The 32x32 canvas keeps encoding fast even on mobile.
- **Alternatives considered**: Higher component counts (5x5) produce longer strings with marginal visual benefit for a placeholder.

### Blurhash decode resolution
- **Decision**: Decode to 32x32 pixels, render on a canvas element, CSS-scale to fill the container.
- **Rationale**: 32x32 is the standard decode size, very fast to compute, and looks good when scaled with CSS since the content is intentionally blurry.

### Video blurhash source
- **Decision**: Extract first frame by creating a `<video>` element, seeking to time 0, waiting for `loadeddata`, then drawing to canvas.
- **Rationale**: First frame is the best available representative for the video content. The delay is negligible since the video file is already loaded as a Blob/File.

### No fallback for missing tags
- **Decision**: If a received Kind 15 message lacks `dim` or `blurhash` tags (e.g. from another client), accept the layout jump.
- **Rationale**: Extracting dimensions after decryption would require decrypting media eagerly, defeating lazy loading. Eventually most messages will come from nospeak clients with these tags.

### Tag format (NIP-94 compatible)
- `["dim", "<width>x<height>"]` — e.g. `["dim", "1920x1080"]`
- `["blurhash", "<encoded-string>"]` — e.g. `["blurhash", "LEHV6nWB2yk8pyo0adR*.7kCMdnj"]`

### DB schema
- Add optional fields `fileWidth?: number`, `fileHeight?: number`, `fileBlurhash?: string` to the `Message` interface.
- Dexie auto-schema handles new optional fields without migration.

## Risks / Trade-offs
- **Blurhash encoding adds latency before send**: Mitigated by using a tiny 32x32 canvas — encoding is <50ms even on low-end devices.
- **Video first-frame extraction may fail on some formats**: The system should gracefully skip blurhash if extraction fails, still sending `dim` if dimensions are available.
- **New dependency (`blurhash`)**: Small, well-maintained library (~4KB gzipped), no transitive dependencies.
- **Tag payload size**: Blurhash strings are ~20-30 chars, `dim` is ~10 chars — negligible impact on event size.

## Open Questions
- None — all design decisions resolved during planning.
