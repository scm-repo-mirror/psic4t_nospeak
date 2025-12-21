## RENAMED Requirements
- FROM: `### Requirement: Message Notifications Toggle in Settings`
- TO: `### Requirement: Notifications Toggle in Settings`

## MODIFIED Requirements
### Requirement: Notifications Toggle in Settings
The Settings interface SHALL provide a notifications option under Settings → General that controls whether the application attempts to show message and reaction notifications on the current device.

The toggle SHALL persist per device, SHALL default to enabled when no prior preference has been stored (opt-out), and SHALL gate both web and Android notification behavior without depending solely on OS-level permission state.

#### Scenario: Default notifications enabled
- **GIVEN** a user opens the application on a device where no `nospeak` settings have been stored
- **WHEN** the user opens Settings → General
- **THEN** the notifications option SHALL appear in the enabled state by default
- **AND** the system SHALL attempt to show message/reaction notifications only when OS-level notification permission is granted.

#### Scenario: Permission prompt occurs once on explicit login
- **GIVEN** the notifications option is enabled (including by default)
- **AND** OS notification permission is not yet granted
- **AND** the system has not previously prompted for notification permission on this device
- **WHEN** the user performs an explicit login action (local key, extension, or Amber)
- **THEN** the system SHALL request OS notification permission as part of that login flow
- **AND** the login flow SHALL continue regardless of whether permission is granted or denied
- **AND** the system SHALL NOT repeatedly prompt for notification permission on subsequent logins on the same device.

#### Scenario: User disables notifications
- **GIVEN** the notifications option is currently enabled on a device
- **WHEN** the user disables the option in Settings → General
- **THEN** the system SHALL stop attempting to show message/reaction notifications on that device regardless of existing OS-level permission
- **AND** the stored preference SHALL be updated so that notifications remain disabled on subsequent app launches until the user re-enables them.

#### Scenario: User re-enables notifications
- **GIVEN** the notifications option is currently disabled on a device
- **WHEN** the user enables the option in Settings → General
- **THEN** the system SHALL request OS notification permission if not already granted
- **AND** upon permission being granted, message/reaction events SHALL be eligible to trigger notifications according to the messaging and platform requirements.

#### Scenario: Notifications delegated to background service when background messaging enabled
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** the user has enabled Android background messaging
- **AND** notifications are enabled
- **WHEN** a new message or reaction arrives while the app UI is not visible
- **THEN** the system SHALL treat the Android background messaging native foreground service as the primary emitter of Android OS message/reaction notifications
- **AND** the web runtime SHALL suppress JS-driven Android local notification scheduling while background messaging remains enabled.

### Requirement: Android Background Messaging Preference
The Settings interface SHALL provide an Android-only background messaging preference under Settings → General that controls whether the Android app is allowed to keep relay connections and message subscriptions active while the app UI is not visible.

This preference SHALL be stored per Android installation and SHALL be compatible with the Notifications toggle:
- When Notifications are disabled, background messaging SHALL be treated as disabled and the preference SHALL NOT be user-configurable.
- When Notifications are enabled and no prior preference has been stored, the background messaging preference SHALL default to enabled (opt-out).

The preference persistence mechanism SHALL survive device restarts and app updates and SHALL be readable by Android-native components (for example, boot receivers) without requiring the WebView to start.

When the current session is a local-key (nsec) session and the Android-native secret key required for background decryption is missing, the system SHALL disable background messaging for that installation rather than keeping the service running in a degraded state.

#### Scenario: Default background messaging enabled
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** Notifications are enabled
- **AND** no background messaging preference has been stored for this Android installation
- **WHEN** the user opens Settings → General
- **THEN** the background messaging preference SHALL be enabled by default.

#### Scenario: Background messaging is hidden when notifications are disabled
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** Notifications are disabled
- **WHEN** the user opens Settings → General
- **THEN** the background messaging preference control SHALL NOT be shown.

#### Scenario: Disabling notifications disables background messaging
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** background messaging is enabled
- **WHEN** the user disables Notifications
- **THEN** the system SHALL disable background messaging for that installation
- **AND** the native foreground service SHALL stop.

#### Scenario: Background messaging does not start when notifications are disabled
- **GIVEN** Notifications are disabled for the current Android installation
- **WHEN** the Android shell attempts to start or restore background messaging (including on boot)
- **THEN** the native foreground service SHALL NOT be started.

#### Scenario: Background messaging auto-disables when local secret is missing
- **GIVEN** the user previously enabled Android background messaging in Settings → General
- **AND** the current session is a local-key (nsec) session
- **AND** the Android-native secret key required for local-key background decryption is missing
- **WHEN** the Android shell attempts to start or restore background messaging (including on boot)
- **THEN** the system SHALL persistently disable the background messaging preference for that installation
- **AND** the native foreground service SHALL stop
- **AND** the user MUST re-login before background messaging can be enabled again.
