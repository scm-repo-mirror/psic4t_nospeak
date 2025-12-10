# Change: Add camera capture to media upload

## Why
Users on Android and mobile web want to quickly capture and send photos directly from the chat "add media" popup without first saving them to the gallery, while keeping uploads efficient and aligned with existing NIP-98 media upload behavior.

## What Changes
- Add a cross-platform camera capture option ("Take photo") to the chat media upload affordance, available in the Android Capacitor shell and mobile browsers.
- Define client-side image resizing for captured photos so uploaded media is constrained to a maximum dimension of 2048px and reasonable file size before being sent to the canonical upload endpoint.
- Specify Android-native camera integration via Capacitor Camera in the Android app shell, reusing the existing NIP-98 authenticated media upload endpoint and messaging semantics.
- Clarify how captured-media URLs are inserted into the message input and rendered by the existing messaging pipeline.

## Impact
- Affected specs: `messaging`, `android-app-shell`.
- Affected code: chat message input UI (`MediaUploadButton` and related components), Android Capacitor shell integration, client-side media processing before upload.
