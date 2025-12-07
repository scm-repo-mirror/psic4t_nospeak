## ADDED Requirements
### Requirement: Message Notifications Toggle in Settings
The Settings interface SHALL provide a message notifications option under Settings  General that controls whether the application attempts to show new-message notifications on the current device. The toggle SHALL persist per device, SHALL default to disabled when no prior preference has been stored, and SHALL gate both web and Android notification behavior without depending solely on OS-level permission state.

#### Scenario: Default notifications disabled
- **GIVEN** a user opens the application on a device where no `nospeak` settings have been stored
- **WHEN** the user opens Settings  General
- **THEN** the message notifications option SHALL appear in the disabled state by default
- **AND** the system SHALL NOT attempt to show new-message notifications until the user explicitly enables the option and the platform grants notification permission.

#### Scenario: User enables notifications on web
- **GIVEN** the user is accessing nospeak in a standard web browser that supports the Notifications API
- **AND** the message notifications option is currently disabled
- **WHEN** the user enables the option in Settings  General
- **THEN** the system SHALL request browser notification permission if not already granted
- **AND** upon permission being granted, the preference for message notifications SHALL be stored so that the enabled state persists across reloads on that device
- **AND** new-message events SHALL be eligible to trigger browser notifications according to the messaging notification requirements.

#### Scenario: User enables notifications in Android app
- **GIVEN** the user is running nospeak inside the Android Capacitor app shell
- **AND** the message notifications option is currently disabled
- **WHEN** the user enables the option in Settings  General
- **THEN** the app SHALL request OS-level permission for local notifications via the Android runtime
- **AND** upon permission being granted, the preference for message notifications SHALL be stored so that the enabled state persists for that Android installation
- **AND** new-message events SHALL be eligible to trigger local notifications through the Android notification system.

#### Scenario: User disables message notifications
- **GIVEN** the message notifications option is currently enabled on a device
- **WHEN** the user disables the option in Settings  General
- **THEN** the system SHALL stop attempting to show new-message notifications on that device regardless of existing OS-level permission
- **AND** the stored preference SHALL be updated so that notifications remain disabled on subsequent app launches until the user re-enables them.
