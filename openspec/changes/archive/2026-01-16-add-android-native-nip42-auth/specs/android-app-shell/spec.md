## ADDED Requirements

### Requirement: Android Native Background Messaging NIP-42 Authentication
When running inside the Android Capacitor app shell with background messaging enabled, the native foreground service responsible for background messaging SHALL support NIP-42 client authentication (kind `22242` AUTH) when a relay requires it for subscriptions. The service SHALL authenticate only when required by the relay, and SHALL NOT proactively authenticate on connect absent a relay challenge or explicit `auth-required:` closure.

When a relay requires authentication for the background messaging subscription:
- The service SHALL store AUTH challenges received from relays.
- When the relay closes the subscription with an `auth-required:` reason, the service SHALL build and sign a kind 22242 AUTH event.
- In `nsec` mode, the service SHALL sign the AUTH event locally using BIP-340 Schnorr signatures.
- In `amber` mode, the service SHALL sign the AUTH event via the NIP-55 ContentResolver endpoint.
- If authentication succeeds, the service SHALL re-subscribe to the relay exactly once.
- If authentication fails, the service SHALL retry once after a 5-second delay before marking the relay as auth-failed for that session.

#### Scenario: Background service authenticates when relay requires auth for subscription
- **GIVEN** the Android foreground service for background messaging is running
- **AND** the user is logged in with either nsec or amber mode
- **AND** a configured read relay requires NIP-42 authentication for subscriptions
- **WHEN** the relay closes the background messaging subscription with an `auth-required:` reason
- **THEN** the service SHALL build a kind 22242 AUTH event with the relay URL and stored challenge
- **AND** SHALL sign the event using the appropriate signer (local Schnorr for nsec, ContentResolver for amber)
- **AND** SHALL send the signed AUTH event to the relay
- **AND** upon receiving an OK confirmation, SHALL re-subscribe to kind 1059 gift-wrapped events.

#### Scenario: Background service retries auth once after failure
- **GIVEN** the Android foreground service for background messaging is running
- **AND** a relay requires NIP-42 authentication
- **WHEN** the initial authentication attempt fails (signing fails, relay rejects, or timeout)
- **THEN** the service SHALL schedule a single retry after 5 seconds
- **AND** if the retry also fails, the service SHALL mark the relay as auth-failed for this session
- **AND** the service SHALL NOT attempt further authentication until the relay reconnects.

#### Scenario: Background service handles AUTH challenge messages
- **GIVEN** the Android foreground service for background messaging is connected to a relay
- **WHEN** the relay sends an `["AUTH", "<challenge>"]` message
- **THEN** the service SHALL store the challenge associated with that relay URL
- **AND** SHALL use the stored challenge when building AUTH events for that relay.

#### Scenario: Background service signs AUTH events in nsec mode
- **GIVEN** the Android foreground service is running in nsec mode with a local secret key
- **WHEN** the service needs to sign a kind 22242 AUTH event
- **THEN** it SHALL compute the event ID as SHA-256 of the NIP-01 serialized event
- **AND** SHALL sign the event ID using BIP-340 Schnorr signature with the local secret key
- **AND** SHALL return the complete signed event with id and sig fields.

#### Scenario: Background service signs AUTH events in amber mode
- **GIVEN** the Android foreground service is running in amber mode
- **AND** the user has granted "remember my choice" for kind 22242 signing
- **WHEN** the service needs to sign a kind 22242 AUTH event
- **THEN** it SHALL query the NIP-55 ContentResolver SIGN_EVENT endpoint with the unsigned event
- **AND** SHALL use the signed event returned by the signer
- **AND** if the signer returns null or rejected, SHALL treat the auth attempt as failed.

### Requirement: Android Amber Permission Request Includes AUTH Signing
When running inside the Android Capacitor app shell, the Amber login flow SHALL request permission to sign kind 22242 (NIP-42 AUTH) events in addition to the existing permissions, so that background messaging can authenticate with relays without requiring interactive signer prompts.

#### Scenario: Amber login requests kind 22242 signing permission
- **GIVEN** the nospeak Android Capacitor app shell is installed
- **AND** a NIP-55-compatible signer app such as Amber is installed
- **WHEN** the user initiates "Login with Amber" and the app sends the get_public_key intent
- **THEN** the permissions extra SHALL include kind 22242 in the sign_event kinds list
- **AND** if the user grants "remember my choice" for this permission, background AUTH signing SHALL work via ContentResolver without additional prompts.
