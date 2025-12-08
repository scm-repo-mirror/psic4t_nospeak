## MODIFIED Requirements
### Requirement: Android Background Message Delivery
When running inside the Android Capacitor app shell with background messaging enabled, the messaging experience on Android SHALL delegate background message reception and notification to a native foreground service that connects to the user's read relays, subscribes to gift-wrapped messages, and triggers OS notifications even while the WebView is suspended. The native service SHALL always treat gift-wrapped events as opaque envelopes and raise only generic "new encrypted message" notifications, regardless of whether the current session uses an on-device nsec or an external signer such as Amber.

#### Scenario: Background subscriptions deliver generic notifications on Android
- **GIVEN** the user is logged in and has enabled background messaging in Settings → General while running inside the Android Capacitor app shell
- AND the native Android foreground service for background messaging is active
- WHEN a new gift-wrapped message addressed to the current user is delivered from any configured read relay while the app UI is not visible
- THEN the native service SHALL treat the event as an opaque envelope and SHALL NOT attempt to decrypt the message content
- AND it SHALL raise an Android OS notification that indicates a new encrypted message has arrived without revealing the sender's identity or message content
- AND the user SHALL only see the decrypted sender and content after returning to the app and allowing the existing foreground messaging pipeline (including Amber where applicable) to process the message.

#### Scenario: Background delivery respects notification settings and permissions
- **GIVEN** the user is running nospeak in the Android app, and the native background messaging service is active
- WHEN message notifications are disabled in Settings → General for the current device, or Android has denied local notification permission
- THEN the native background messaging service SHALL continue to maintain relay subscriptions as long as background messaging remains enabled
- AND it SHALL NOT surface OS notifications for new messages while notifications are disabled or permission is denied
- AND the rest of the background behavior (message availability when the app is brought to the foreground) SHALL continue to function according to the current authorization mode.
