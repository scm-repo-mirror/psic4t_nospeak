## ADDED Requirements
### Requirement: Native PWA Notifications
The system SHALL use the Service Worker API to display system notifications on supported devices, ensuring compatibility with mobile PWAs where the standard Notification constructor is not supported or reliable.

#### Scenario: Display notification via Service Worker
- **WHEN** `showNewMessageNotification` is called
- **THEN** the notification is displayed using `serviceWorkerRegistration.showNotification`
- **AND** the notification includes title, body, icon, and tag

#### Scenario: Notification Click Handling
- **WHEN** a user clicks on a system notification
- **THEN** the corresponding application window is focused
- **AND** the application navigates to the sender's chat URL
- **AND** the notification is closed

#### Scenario: Permission Request
- **WHEN** requesting notification permissions
- **THEN** the standard `Notification.requestPermission()` API is used
