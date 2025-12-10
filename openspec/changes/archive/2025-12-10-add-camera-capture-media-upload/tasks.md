## 1. Implementation
- [x] 1.1 Add @capacitor/camera dependency and sync Android project
- [x] 1.2 Implement reusable client-side image resizing helper for captured photos (max 2048px, JPEG re-encode)
- [x] 1.3 Extend media upload dropdown to include a "Take photo" option with platform-aware availability
- [x] 1.4 Implement Android-native camera capture flow using Capacitor Camera, resizing, and NIP-98 authenticated upload
- [x] 1.5 Implement mobile web camera capture flow via file input with capture hint, resizing, and NIP-98 authenticated upload
- [x] 1.6 Ensure captured photo URLs are inserted into the message input and rendered like existing image uploads
- [x] 1.7 Add or update tests around media upload behavior where feasible (e.g., upload helpers and NIP-98 auth wiring)
- [x] 1.8 Run `npm run check` and `npx vitest run` and address any failures
- [x] 1.9 Build and run the Android app shell to manually verify camera capture on-device

## 2. Validation
- [x] 2.1 Validate captured image dimensions and approximate file sizes across a range of devices
- [x] 2.2 Verify behavior on Android native shell, Android mobile web, and at least one iOS mobile browser where supported
- [x] 2.3 Confirm that error paths (permission denied, cancelled capture, upload failure) surface non-blocking UI and do not break messaging.
