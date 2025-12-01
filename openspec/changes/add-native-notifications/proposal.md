# Change: Add Native PWA Notifications

## Why
Current browser notifications do not work reliably on mobile devices (Android/iOS) when installed as a PWA. To support mobile notifications, the application must utilize the Service Worker API for displaying notifications and handling interactions.

## What Changes
- Switch `vite-plugin-pwa` to `injectManifest` strategy to support custom service worker logic.
- Implement a custom `service-worker.ts` to handle notification display and click events.
- Update `NotificationService.ts` to delegate notification creation to the service worker registration.
- Ensure proper PWA manifest configuration for standalone display.

## Impact
- **Affected specs**: `notifications` (new capability)
- **Affected code**: `src/lib/core/NotificationService.ts`, `vite.config.ts`, new `src/service-worker.ts`
