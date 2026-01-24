## 1. Dependencies and DB Schema
- [x] 1.1 Install `blurhash` npm package (`npm install --save blurhash`)
- [x] 1.2 Add `fileWidth?: number`, `fileHeight?: number`, `fileBlurhash?: string` fields to `Message` interface in `src/lib/db/db.ts`

## 2. Media Metadata Extraction Utility
- [x] 2.1 Create `src/lib/utils/mediaMetadata.ts` with:
  - `getImageMetadata(file: File): Promise<{ width: number; height: number; blurhash: string }>` — loads image via `Image` element, draws to 32x32 canvas, encodes blurhash (4x3 components)
  - `getVideoMetadata(file: File): Promise<{ width: number; height: number; blurhash: string }>` — loads video, seeks to first frame via `loadeddata`, draws to 32x32 canvas, encodes blurhash (4x3 components)
  - Both functions should throw/reject on failure so callers can catch and proceed without metadata
- [x] 2.2 Write unit tests for `mediaMetadata.ts` (mock Image/Video/Canvas APIs)

## 3. Send-Side: Add dim and blurhash Tags
- [x] 3.1 Update `sendFileMessage()` in `src/lib/core/Messaging.ts` to accept optional `width?: number`, `height?: number`, `blurhash?: string` parameters
- [x] 3.2 Update `sendGroupFileMessage()` in `src/lib/core/Messaging.ts` to accept the same optional parameters
- [x] 3.3 In both methods, push `["dim", "${width}x${height}"]` and `["blurhash", blurhash]` tags when values are provided
- [x] 3.4 Update `ChatView.svelte` to call `getImageMetadata()` or `getVideoMetadata()` before calling send methods, passing extracted metadata (catch errors gracefully — send without metadata on failure)

## 4. Receive-Side: Parse dim and blurhash Tags
- [x] 4.1 In the Kind 15 receive handler in `Messaging.ts` (~line 278-311), parse `dim` tag (split on `x`, parseInt both values) and `blurhash` tag
- [x] 4.2 Store parsed values as `fileWidth`, `fileHeight`, `fileBlurhash` in the Message record saved to the database

## 5. UI: Blurhash Placeholder Rendering
- [x] 5.1 In `MessageContent.svelte`, when `fileWidth`, `fileHeight`, and `fileBlurhash` are available, wrap media in a container with `aspect-ratio: {width}/{height}` and `max-height: 300px`
- [x] 5.2 Decode blurhash to 32x32 pixels using `decode()` from the `blurhash` package, render to a canvas element inside the container
- [x] 5.3 Hide the blurhash canvas when the real image/video loads (`onload`/`onloadeddata` event)
- [x] 5.4 Ensure messages without `dim`/`blurhash` metadata still render with existing styling (no regression)

## 6. Validation
- [x] 6.1 Run `npm run check` and fix any type errors
- [x] 6.2 Run `npx vitest run` and fix any test failures
