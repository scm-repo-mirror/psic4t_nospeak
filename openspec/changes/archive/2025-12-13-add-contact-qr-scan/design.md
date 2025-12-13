## Context
The nospeak messaging client already supports:
- A Manage Contacts modal that adds contacts by `npub`, resolving profile metadata and adding them to the local contact list.
- An Android Capacitor app shell with native integrations for camera-based media capture and haptics.
- A User QR modal that generates a `nostr:npub…` QR code for the current user.

Users now want the inverse flow on Android: scanning another person's `nostr:npub` QR code to add them as a contact, using a live camera preview and continuous scanning.

## Goals / Non-Goals
- **Goals**
  - Provide an Android-only contact QR scan button and modal that feel consistent with existing glass-style modals.
  - Use a live camera preview with continuous decoding while the modal is open.
  - Accept only `nostr:npub…` and bare `npub…` QR payloads for this feature.
  - Reuse the existing "add contact by npub" logic to keep behavior consistent with the Manage Contacts modal.
- **Non-Goals**
  - Supporting other NIP-19 encodings (such as `nprofile`, `nevent`, or complex URLs) in this first iteration.
  - Surfacing contact QR scan on non-Android platforms.
  - Implementing general-purpose QR scanning outside the contact-add flow.

## Decisions
- **D1: Android-only gating via Capacitor environment check**
  - Use the existing `isAndroidNative()` helper to gate both the contacts header scan button and the scan modal behavior.
  - Rationale: Keeps the feature constrained to the Android Capacitor app shell as requested, while leaving the web UI unchanged.

- **D2: Live preview via WebView `getUserMedia` instead of still-image camera captures**
  - Use `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })` from inside the Android Capacitor WebView to drive a `<video>` element, and periodically sample frames into a `<canvas>` for QR decoding.
  - Rationale: Capacitor's Camera plugin is designed for single-shot captures rather than continuous preview. The WebView's media APIs provide a smoother live scanning experience while still running within the Capacitor shell and subject to Android camera permissions.

- **D3: QR decoding via a small client-side library**
  - Introduce a lightweight QR decoder (for example, `jsQR`) that operates on `ImageData` extracted from a `<canvas>`.
  - Wrap library usage in a small helper function that accepts `ImageData` and returns the decoded text or `null`.
  - Rationale: Keeps decoding concerns isolated and testable, and avoids tightly coupling the UI to a specific QR library.

- **D4: Shared contact-add helper for `npub` values**
  - Extract a small `addContactByNpub(npub: string)` helper that encapsulates profile resolution and contact creation, and use it from both the Manage Contacts modal and the new scan modal.
  - Rationale: Ensures that all npub-based adds follow the same path, reducing the chance of drift between manual entry and QR-based entry.

- **D5: Conservative QR payload acceptance**
  - Implement a strict parser that:
    - Strips an optional `nostr:` prefix and
    - Accepts the QR payload only if it begins with `npub1`.
  - Rationale: Matches the user request (only `nostr:npub` and bare `npub`) and avoids misinterpreting unrelated QR codes as contacts.

## Risks / Trade-offs
- **R1: WebView camera permissions and compatibility**
  - Risk: Some Android WebView configurations or devices might restrict `getUserMedia` usage or require explicit permission prompts that users decline.
  - Mitigation: Detect lack of camera support or permission errors and present a clear, non-blocking error message in the modal, while leaving the rest of messaging functionality unaffected.

- **R2: Performance and battery impact of continuous scanning**
  - Risk: Continuously sampling frames and decoding QR codes can increase CPU and battery usage while the modal is open.
  - Mitigation: Limit scanning to when the modal is visible, stop the camera and decoding loop as soon as a valid `npub` is found or when the modal is closed, and allow users to dismiss the modal at any time.

- **R3: User confusion when scanning non-nostr QR codes**
  - Risk: Users might attempt to scan arbitrary QR codes (for example, URLs or payment requests), which this feature will reject.
  - Mitigation: Provide specific error copy when a QR is decoded but does not contain a `nostr:npub` or `npub`, and keep the modal open with an option to "Scan again".

## Migration Plan
- The change is additive and scoped to the Android app shell.
- No data migrations are required; the feature only adds a new way to populate the existing contacts store.
- If issues arise, the feature can be disabled by hiding the scan button and modal behind the `isAndroidNative()` check, without impacting existing contact management flows.

## Open Questions
- Should the modal automatically close a few seconds after successfully adding a contact, or remain open so the user can add multiple contacts in succession?
- Should the contact-add flow surface additional context (for example, showing the resolved profile name and picture) inside the scan modal after a successful scan, or is the existing contacts list feedback sufficient?
