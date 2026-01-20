# Change: Fix Profile Fetching During Initial Sync by Using Discovery Relays

## Why
During initial history sync, contact profiles and user profiles are not being fetched when the user has a single blank/new messaging relay. This happens because discovery relays are cleaned up before profile fetching steps (5 and 6) execute, leaving only the user's messaging relay connected. A new or blank relay won't have contact profiles or even the user's own profile metadata.

## What Changes
- Steps 5 (fetch contact profiles) and 6 (fetch user profile) of the login history sync flow SHALL temporarily reconnect to discovery relays alongside the user's persistent messaging relays
- Profile resolution during these steps will query both discovery relays AND the user's messaging relays, increasing the likelihood of finding profiles regardless of where they're published
- Discovery relays are cleaned up after both profile fetch steps complete

## Impact
- Affected specs: `messaging` (First-Time Sync Progress Indicator requirement)
- Affected code: `src/lib/core/AuthService.ts` (runLoginHistoryFlow method, lines ~345-362)
