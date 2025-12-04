# Change: Add NIP-05 verification status

## Why
Profiles currently display NIP-05 identifiers without verifying them against NIP-05 DNS records, which can mislead users about identity and trust. We also want search results and profile views to consistently treat verified NIP-05 identities as first-class signals.

## What Changes
- Add client-side NIP-05 verification that follows the official NIP-05 specification using \/.well-known\/nostr.json lookups.
- Cache per-profile NIP-05 verification status and last-checked time in the profile storage layer.
- Update contact search to prefer and visually mark results with verified NIP-05 identifiers and to explicitly indicate invalid identifiers.
- Update profile and settings views to display NIP-05 identifiers consistently, treating  as  in the UI and avoiding unearned verification badges.

## Impact
- Affected specs: messaging, settings
- Affected code: profile resolver and repository, contact search, Profile modal, Manage Contacts modal, Settings modal.
