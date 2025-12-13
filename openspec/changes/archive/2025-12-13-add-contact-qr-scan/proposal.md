# Change: Android contact QR scan to add contacts

## Why
Users currently must type or paste `npub` values or search by name to add contacts, which is slow and error-prone on mobile devices. Many Nostr users already share `nostr:npub` QR codes, especially when meeting in person, so nospeak should support scanning those codes directly on Android.

## What Changes
- Add an Android-only "Scan QR" button in the contacts header, positioned to the left of the existing "Manage" button.
- Provide a full-screen glass-style "Scan contact QR" modal that shows a live camera preview and continuously scans for QR codes while open.
- Decode QR content into an `npub` when the QR text is either `nostr:npub…` or a bare `npub…`, and reuse the existing "add by npub" flow to resolve profile metadata and add the contact.
- Treat non-`npub` QR codes as invalid for this flow, surfacing a non-blocking error and allowing the user to retry scanning.
- Restrict this capability to the Android Capacitor app shell; on web, the scan button and modal SHALL not be exposed.

## Impact
- **Specs**: Add a new messaging requirement describing the Android contact QR scan button, QR decoding rules (`nostr:npub` / bare `npub` only), Android-only availability, and success/failure scenarios.
- **Code (frontend)**: Update the contacts header UI, add a new global modal wired into the existing modals layer, integrate live camera preview and QR decoding, and share the existing contact-add-by-npub behavior with the Manage Contacts modal.
- **Android shell**: The feature runs only when nospeak is inside the Android Capacitor shell, relying on the shell's camera permissions and WebView capabilities; behavior on pure web browsers remains unchanged.
