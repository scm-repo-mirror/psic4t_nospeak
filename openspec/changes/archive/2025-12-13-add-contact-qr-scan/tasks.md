## 1. Specification and Design
- [x] 1.1 Review existing messaging and android-app-shell specs related to contacts, QR codes, and Android camera behavior
- [x] 1.2 Finalize the Android-only scope, accepted QR payload formats, and UX details for the scan button and modal

## 2. UI and State Wiring
- [x] 2.1 Add an Android-only "Scan QR" control to the contacts header, positioned to the left of the existing "Manage" button
- [x] 2.2 Introduce a new global modal store flag for the Scan Contact QR modal and wire it into the root layout alongside existing modals
- [x] 2.3 Create a new Scan Contact QR Svelte component that renders a glass-style full-screen modal with a live camera preview container and status messages

## 3. Camera and QR Decoding
- [x] 3.1 Integrate Android WebView camera access using `navigator.mediaDevices.getUserMedia` scoped to the Android Capacitor app shell
- [x] 3.2 Add a lightweight QR decoding helper that accepts canvas image data and returns decoded text using a small client-side library
- [x] 3.3 Implement a parsing helper that normalizes decoded QR text to an `npub` string when the payload is either a bare `npub` or a `nostr:npub` URI, and rejects all other payload types

## 4. Contact Add Flow Integration
- [x] 4.1 Extract a shared `addContactByNpub` helper that encapsulates profile resolution and contact creation
- [x] 4.2 Update the Manage Contacts modal to use the shared helper for direct `npub` adds
- [x] 4.3 Invoke the shared helper from the Scan Contact QR modal when a valid `npub` is decoded, handling success and error cases with non-blocking UI feedback

## 5. Platform Guards and UX Edge Cases
- [x] 5.1 Ensure the scan button and modal are only exposed when `isAndroidNative()` is true, and remain hidden in standard web browsers
- [x] 5.2 Handle camera permission errors or lack of camera support by showing clear, non-blocking error copy and allowing the user to dismiss the modal
- [x] 5.3 Stop the camera stream and QR decoding loop whenever the modal is closed or after a successful contact add, to avoid unnecessary background resource usage

## 6. Localization, Testing, and Validation
- [x] 6.1 Add localized strings for the Scan Contact QR UI (button label, modal title, scanning status, and error messages) in all supported languages
- [x] 6.2 Add unit tests for the QR payload parsing helper and the shared `addContactByNpub` helper
- [x] 6.3 Extend the ContactList tests to assert the presence and placement of the Android-only scan button markup
- [x] 6.4 Run `npm run check` and `npx vitest run` to validate type-checking and tests
- [x] 6.5 Run `openspec validate add-contact-qr-scan --strict` and resolve any remaining validation issues
