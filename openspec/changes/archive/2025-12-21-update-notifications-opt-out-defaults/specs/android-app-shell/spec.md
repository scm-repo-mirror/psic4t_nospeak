## MODIFIED Requirements
### Requirement: Android Local Notifications via Capacitor Plugin
The Android Capacitor app shell SHALL integrate with `@capacitor/local-notifications` (or an equivalent Capacitor local notifications plugin) to deliver OS-native notifications for new messages when notifications are enabled, aligning with the messaging notification requirements and existing branding constraints.

#### Scenario: Android app registers local notification channel
- **GIVEN** the nospeak Android app is installed and launched on a supported Android device
- **WHEN** the app initializes its Capacitor runtime and messaging environment
- **THEN** it SHALL register at least one notification channel dedicated to message notifications with an icon consistent with the messaging and visual-design specs
- **AND** this channel SHALL be used for all local notifications triggered for new messages.

#### Scenario: Permission request uses Android notification APIs during explicit login
- **GIVEN** the user is running nospeak inside the Android app shell
- **AND** notifications are enabled (including by default)
- **AND** Android local notification permission is not granted
- **WHEN** the user performs an explicit login action
- **THEN** the app SHALL request OS-level notification permission using the Android notification permission APIs exposed by the Capacitor local notifications plugin
- **AND** it SHALL handle denial or revocation gracefully by keeping the app functional and reflecting that notifications cannot be delivered.

#### Scenario: Permission request uses Android notification APIs when user re-enables notifications
- **GIVEN** the user is running nospeak inside the Android app shell
- **AND** notifications are currently disabled in Settings → General
- **WHEN** the user enables notifications in Settings → General
- **THEN** the app SHALL request OS-level permission for local notifications via the Capacitor local notifications plugin.

#### Scenario: Web behavior unchanged outside Android shell
- **GIVEN** the user is accessing nospeak in a standard web browser rather than the Android app shell
- **WHEN** notifications are enabled or disabled in Settings → General
- **THEN** no Capacitor local notifications plugin APIs SHALL be invoked
- **AND** notifications SHALL rely solely on the existing web mechanisms described in the messaging specification.

## ADDED Requirements
### Requirement: Android Boot Respects Notification Opt-out
The Android Capacitor app shell SHALL ensure that Android background messaging is not automatically started by boot receivers or package-replace receivers when Notifications are disabled for the installation.

#### Scenario: Boot receiver does not start background service when notifications disabled
- **GIVEN** the user previously disabled Notifications on this Android installation
- **AND** the Android device reboots (or the app is updated)
- **WHEN** the Android boot/package-replace receiver evaluates whether to start background messaging
- **THEN** the Android background messaging foreground service SHALL NOT be started.

#### Scenario: Boot receiver may start background service when notifications enabled
- **GIVEN** Notifications are enabled for this Android installation
- **AND** background messaging is enabled for this Android installation
- **AND** the Android device reboots (or the app is updated)
- **WHEN** the Android boot/package-replace receiver evaluates whether to start background messaging
- **THEN** it MAY start the Android background messaging foreground service according to the existing background messaging requirements.
