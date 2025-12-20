## MODIFIED Requirements

### Requirement: Message Notifications Toggle in Settings
The Settings interface SHALL provide a message notifications option under Settings → General that controls whether the application attempts to show new-message notifications on the current device. The toggle SHALL persist per device, SHALL default to disabled when no prior preference has been stored, and SHALL gate both web and Android notification behavior without depending solely on OS-level permission state.

#### Scenario: Default notifications disabled
- **GIVEN** a user opens the application on a device where no `nospeak` settings have been stored
- **WHEN** the user opens Settings → General
- **THEN** the message notifications option SHALL appear in the disabled state by default
- **AND** the system SHALL NOT attempt to show new-message notifications until the user explicitly enables the option and the platform grants notification permission.

#### Scenario: User enables notifications on web
- **GIVEN** the user is accessing nospeak in a standard web browser that supports the Notifications API
- **AND** the message notifications option is currently disabled
- **WHEN** the user enables the option in Settings → General
- **THEN** the system SHALL request browser notification permission if not already granted
- **AND** upon permission being granted, the preference for message notifications SHALL be stored so that the enabled state persists across reloads on that device
- **AND** new-message events SHALL be eligible to trigger browser notifications according to the messaging notification requirements.

#### Scenario: User enables notifications in Android app
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** the message notifications option is currently disabled
- **WHEN** the user enables the option in Settings → General
- **THEN** the app SHALL request OS-level permission for local notifications via the Android runtime
- **AND** upon permission being granted, the preference for message notifications SHALL be stored so that the enabled state persists for that Android installation
- **AND** new-message events SHALL be eligible to trigger local notifications through the Android notification system.

#### Scenario: Notifications delegated to background service when background messaging enabled
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** the user has enabled Android background messaging
- **WHEN** the user enables message notifications in Settings → General
- **THEN** the system SHALL treat the Android background messaging native foreground service as the primary emitter of Android OS message/reaction notifications
- **AND** the web runtime SHALL suppress JS-driven Android local notification scheduling while background messaging remains enabled.

#### Scenario: User disables message notifications
- **GIVEN** the message notifications option is currently enabled on a device
- **WHEN** the user disables the option in Settings → General
- **THEN** the system SHALL stop attempting to show new-message notifications on that device regardless of existing OS-level permission
- **AND** the stored preference SHALL be updated so that notifications remain disabled on subsequent app launches until the user re-enables them.

### Requirement: Android Background Messaging Preference
The Settings interface SHALL provide an Android-only background messaging preference under Settings → General that controls whether the Android app is allowed to keep relay connections and message subscriptions active while the app UI is not visible. The preference SHALL be stored per Android installation and SHALL be independent from, but compatible with, the existing message notifications toggle. The preference persistence mechanism SHALL survive device restarts and app updates and SHALL be readable by Android-native components (for example, boot receivers) without requiring the WebView to start.

#### Scenario: Background messaging toggle default and visibility
- **GIVEN** a user opens Settings → General inside the Android Capacitor app shell on a device where no background messaging preference has been stored
- **WHEN** the settings view is rendered
- **THEN** the background messaging preference SHALL appear in the disabled state by default
- **AND** the control SHALL be visible only when running inside the Android app shell (not in standard web browsers).

#### Scenario: User enables Android background messaging
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** the background messaging preference is currently disabled
- **WHEN** the user enables the background messaging option in Settings → General
- **THEN** the app SHALL persist the enabled state for that Android installation
- **AND** it SHALL prompt the user to grant any required Android background activity or battery optimization permissions (for example, by navigating to the appropriate system settings screen)
- **AND** upon confirmation or best-effort completion of the OS permission flow, the app SHALL be eligible to start the Android background messaging foreground service.

#### Scenario: Background messaging enables background notification delivery
- **GIVEN** the user has enabled Android background messaging
- **AND** the message notifications toggle is enabled and notification permission is granted
- **WHEN** the app UI is not visible and gift-wrapped messages or reactions arrive
- **THEN** the system SHALL allow the Android-native foreground service to emit OS notifications for this activity
- **AND** the system SHALL NOT require the WebView to be executing for these notifications to be emitted.

#### Scenario: User disables Android background messaging
- **GIVEN** the background messaging preference is currently enabled on an Android device
- **WHEN** the user disables the background messaging option in Settings → General
- **THEN** the app SHALL persist the disabled state for that installation
- **AND** it SHALL stop any active Android background messaging foreground service
- **AND** it SHALL close background relay connections associated with that service.

#### Scenario: Preference persists across reboot and app update
- **GIVEN** the user previously enabled Android background messaging on a device
- **WHEN** the device reboots or the nospeak Android app is updated
- **THEN** the persisted preference state SHALL remain available for that Android installation
- **AND** it SHALL be available to Android-native components used to restore background messaging behavior.

#### Scenario: Web settings behavior unchanged outside Android
- **GIVEN** the user opens Settings → General in a standard web browser (not inside the Android app shell)
- **WHEN** the settings view is rendered
- **THEN** no Android background messaging preference control SHALL be shown
- **AND** the existing message notifications toggle and other settings SHALL behave as already defined in the `settings` specification.
