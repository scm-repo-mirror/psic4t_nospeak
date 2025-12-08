# android-app-shell Specification

## Purpose
TBD - created by archiving change add-android-local-notifications. Update Purpose after archive.
## Requirements
### Requirement: Android Local Notifications via Capacitor Plugin
The Android Capacitor app shell SHALL integrate with `@capacitor/local-notifications` (or an equivalent Capacitor local notifications plugin) to deliver OS-native notifications for new messages when message notifications are enabled, aligning with the messaging notification requirements and existing branding constraints.

#### Scenario: Android app registers local notification channel
- **GIVEN** the nospeak Android app is installed and launched on a supported Android device
- **WHEN** the app initializes its Capacitor runtime and messaging environment
- **THEN** it SHALL register at least one notification channel dedicated to message notifications with an icon consistent with the messaging and visual-design specs
- **AND** this channel SHALL be used for all local notifications triggered for new messages.

#### Scenario: Permission request uses Android notification APIs
- **GIVEN** the user enables message notifications in Settings  General while running inside the Android app
- **WHEN** the app requests permission to show notifications
- **THEN** it SHALL use the Android notification permission APIs exposed by the Capacitor local notifications plugin
- **AND** it SHALL handle denial or revocation gracefully by keeping the app functional and reflecting that notifications cannot be delivered.

#### Scenario: Web behavior unchanged outside Android shell
- **GIVEN** the user is accessing nospeak in a standard web browser rather than the Android app shell
- **WHEN** message notifications are enabled or disabled in Settings  General
- **THEN** no Capacitor local notifications plugin APIs SHALL be invoked
- **AND** notifications SHALL rely solely on the existing web mechanisms described in the messaging specification.

### Requirement: Android Capacitor App Shell
The project SHALL provide an Android application package that wraps the existing nospeak web client using Capacitor, bundles the compiled web assets locally, and launches directly into the chat experience without requiring an external browser.

#### Scenario: Android app launches bundled nospeak UI
- **GIVEN** the nospeak Android app is installed on a supported Android device
- **WHEN** the user taps the nospeak app icon
- **THEN** the app SHALL open a Capacitor-powered WebView that loads the bundled nospeak web UI from local assets
- **AND** the initial screen SHALL respect the existing startup navigation behavior defined in the `messaging` spec (desktop vs mobile contact list and conversation routing).

#### Scenario: Android app works offline for cached content
- **GIVEN** the user has successfully opened the nospeak Android app at least once and the web assets are bundled locally
- **WHEN** the device is temporarily offline but the user opens the nospeak app again
- **THEN** the app SHALL still load the main chat interface shell from local assets
- **AND** any messaging behavior that depends on relays or remote HTTP endpoints MAY be degraded, but the UI SHALL remain responsive and clearly indicate connection state as defined in existing specs.

### Requirement: Android Build and Release Pipeline
The project SHALL define a documented build and release pipeline for the Android app that uses Capacitor tooling and the Android SDK to produce signed APK/AAB artifacts suitable for distribution.

#### Scenario: Android build command produces installable artifact
- **WHEN** a developer runs the documented Android build command from the repository root
- **THEN** the project SHALL produce an Android build (APK or AAB) that can be installed on an emulator or physical device
- **AND** the build SHALL embed the same nospeak web client version as the current production web build.

#### Scenario: Documented steps for signing and store upload
- **WHEN** a maintainer follows the documented signing and store-upload steps
- **THEN** they SHALL be able to generate a signed Android artifact
- **AND** SHALL be able to submit it to the chosen distribution channel (such as the Google Play Store) without requiring undocumented manual configuration changes.

### Requirement: Android Background Messaging Foreground Service
The Android Capacitor app shell SHALL provide a background messaging mode that keeps the user's read relays connected while the app UI is not visible by running the messaging stack inside an Android foreground service (or equivalent Capacitor-managed background task) with a persistent notification.

#### Scenario: Foreground service keeps relay connections active
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- AND the user has enabled background messaging in Settings → General
- AND Android has granted any required background activity or battery optimization exceptions for the app
- WHEN the user backgrounds the app (for example, by switching to another app or returning to the home screen)
- THEN the app SHALL start or maintain a foreground-capable background task that keeps WebSocket connections to the user's configured read relays active
- AND the background task SHALL reuse the same real-time subscription pipeline defined in the `messaging` spec for receiving and processing messages.

#### Scenario: Background messaging stops when disabled or user signs out
- **GIVEN** background messaging is currently active for the Android app
- WHEN the user either signs out of nospeak or disables background messaging in Settings → General
- THEN the app SHALL stop the background messaging foreground service (or equivalent task)
- AND it SHALL close the associated relay connections
- AND it SHALL remove the persistent foreground notification associated with background messaging.

### Requirement: Persistent Android Foreground Notification for Background Messaging
When Android background messaging is active, the Android app shell SHALL display a persistent foreground notification indicating that nospeak is connected to the user's read relays, including a summary of which relays are connected, and SHALL keep this notification visible as long as background messaging is running.

#### Scenario: Foreground notification shows connected relay summary
- **GIVEN** the Android foreground service for background messaging is running
- WHEN the foreground notification for nospeak is displayed in the Android notification shade
- THEN the notification SHALL indicate that nospeak is syncing messages in the background
- AND it SHALL display the list of connected read relay URLs (up to four entries corresponding to the user's configured read relays)
- AND it SHALL use nospeak branding and iconography consistent with the existing Android local notification and visual-design requirements.

#### Scenario: Foreground notification persists while background messaging is active
- **GIVEN** background messaging is enabled and the foreground service is running
- WHEN the user expands or collapses the Android notification shade
- THEN the notification entry for nospeak background messaging SHALL remain visible and non-dismissible by default while the foreground service is active
- AND the notification SHALL be removed when background messaging stops or is disabled by the user.

#### Scenario: Web behavior unchanged outside Android shell
- **GIVEN** the user is accessing nospeak in a standard web browser rather than the Android app shell
- WHEN they enable or disable message notifications or other messaging settings
- THEN no Android-specific foreground service or persistent notification SHALL be created
- AND notification behavior SHALL remain as defined by the existing web messaging specification.

