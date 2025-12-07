## Context
Nospeak is a fetch-only encrypted messaging client that currently uses the browser Notifications API (and service worker where available) to surface new-message alerts on the web. Inside the Android Capacitor shell, this browser-centric approach is unreliable, and the existing Settings  General notifications toggle is effectively defunct because the WebView does not behave like a standard browser tab and we do not have push delivery. We want Android users to receive OS-level notifications for new messages while the app is running, without introducing server-side push or changing the trust model.

## Goals / Non-Goals
- Goals:
  - Provide OS-native message notifications for the Android Capacitor app using `@capacitor/local-notifications`.
  - Reuse the existing `NotificationService` abstraction so messaging code triggers notifications through a single path that chooses the right implementation for web vs Android.
  - Ensure the Settings  General notifications toggle correctly enables/disables notifications on both platforms and reflects permission state where possible.
  - Keep the notification visuals (title, body, icon, and navigation behavior) consistent with existing messaging and visual-design requirements.
- Non-Goals:
  - Do not introduce push notifications or a server-side delivery channel.
  - Do not attempt to guarantee background delivery when the app is fully terminated; notifications are limited to periods when the Android app and its JS runtime can execute.
  - Do not redesign the overall settings layout or add per-contact/per-conversation notification controls.

## Decisions
- Decision: Use `@capacitor/local-notifications` as the Android notification backend.
  - Rationale: It is the standard Capacitor plugin for local (non-push) OS notifications, integrates with Android notification channels, and avoids adding a custom native module.
- Decision: Extend `NotificationService` to detect the Android native shell (using the existing `isAndroidNative()` helper) and route notification operations through a small adapter around `LocalNotifications` when running inside the Android app.
  - Rationale: Keeps messaging and store logic unaware of platform details and preserves the existing single entry point for notifications.
- Decision: Treat the Settings notifications toggle as a per-device preference that gates whether we attempt to show notifications at all, with a separate platform-specific permission check.
  - Rationale: Matches the existing `nospeak-settings` storage, keeps behavior predictable across web and Android, and avoids tightly coupling UI state to OS permission revocation.
- Alternatives considered:
  - Using only the browser Notifications API inside the WebView: rejected because support is inconsistent or absent in many Android WebView environments.
  - Adding a custom native notification module instead of the Capacitor plugin: rejected as unnecessary complexity given the standard plugin fits our needs.
  - Implementing periodic background fetch to poll for messages while the app is closed: rejected as out-of-scope for this change and potentially fragile given OS background execution limits.

## Risks / Trade-offs
- Android background execution limits may prevent notifications from firing when the app is fully killed or heavily backgrounded; users might expect push-like behavior that we cannot provide without changing the architecture.
- Misaligned permission and toggle state (for example, user enables notifications, then later revokes permission in system settings) could lead to confusing UI; we must handle this gracefully by detecting permission at runtime and updating the UI copy.
- Additional dependency (`@capacitor/local-notifications`) increases the Android app footprint and requires keeping plugin versions compatible with the existing Capacitor setup.

## Migration Plan
- Introduce the Android local notification adapter and wire it into `NotificationService` behind environment detection, ensuring web behavior remains unchanged.
- Update the Settings modal copy and logic so that the notifications toggle works correctly in both environments and can surface platform-specific support/permission messaging.
- Gradually roll out the Android app build with local notifications enabled, validating behavior on a small set of devices (emulator + physical) before broader distribution.
- Document the limitations (no push, app must be running) and any required Android OS settings (e.g., allowing notifications for the app) in project docs or release notes.

## Open Questions
- Should we add any rate limiting or grouping behavior for Android notifications beyond what is already implemented for web (for example, batching messages per contact vs one notification per message)?
- Do we want a future per-contact mute or "do not disturb" feature, and if so, should the current design leave room for additional notification settings?
