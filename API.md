# API.md — /api/v1 Contract

Single source of truth for the app ↔ backend contract. Status: **to be implemented in Phase 2** (see BLUEPRINT.md). The app builds against mocked responses matching this file until then. Any change to this file requires a PR touching both this doc and the server.

## Conventions

- Base URL: `https://mymentallyprepare.com/api/v1`
- Auth: `Authorization: Bearer <Firebase ID token>` on every request except nothing (all v1 endpoints require auth). Tokens verified server-side via Firebase Admin SDK. Web sessions are unaffected; v1 is the app's door.
- All requests and responses are JSON. Times are ISO 8601 UTC; the server owns all IST midnight logic.
- Errors: `{ "error": { "code": "string", "message": "human-readable" } }` with proper HTTP status. Codes the client must handle: `unauthorized`, `not_matched`, `already_sealed_tonight`, `entry_locked`, `rate_limited`, `crisis_resources` (see Safety).
- **Server-owned state (the client never computes these):** seal/unlock status, `currentDay`, pair health state, reveal mutuality outcome, Silent Room expiry.
- Rate limits apply per user; 429 returns `rate_limited` with `retryAfterSeconds`.

## Endpoints

### Auth & account

| Endpoint | Method | Request | Response |
|---|---|---|---|
| `/auth/session` | POST | `{}` (token in header) | `{ user: User, isNew: boolean }` — creates user on first call |
| `/me` | GET | — | `User` |
| `/me` | PATCH | partial `{ pseudonym?, college?, year?, gender?, matchPrefs?, notificationPrefs? }` | `User` |
| `/account/export` | GET | — | full user data JSON (download) |
| `/account` | DELETE | `{ confirm: true }` | `{ deleted: true }` — irreversible, required by Play Store |

`User`: `{ id, pseudonym, college, year, archetype|null, currentDay|null, matchState, notificationPrefs: { nudge: bool, nudgeTime: "21:00", unlock: bool }, createdAt }`

### Scan & matching

| Endpoint | Method | Request | Response |
|---|---|---|---|
| `/scan` | POST | `{ answers: number[11] }` | `{ archetype: "Protector"\|"Connector"\|"Performer"\|"Disconnector", description }` |
| `/match` | GET | — | `MatchState` |
| `/match/rematch` | POST | `{ reason: "ghosted"\|"unsafe"\|"other" }` | `MatchState` — `unsafe` also triggers the safety pipeline |

`MatchState`: `{ status: "unmatched"\|"waiting"\|"matched", partner: { archetype, college (name only), pairDay, health: "active"\|"quiet"\|"fading"\|"ghosted" }|null, waitingSince|null }`

Pair health definitions live in SYSTEMS.md and are computed server-side nightly.

### Entries (the loop)

| Endpoint | Method | Request | Response |
|---|---|---|---|
| `/entries` | GET | `?day=` optional | `{ entries: Entry[] }` (own entries, all days) |
| `/entries` | POST | `{ text, mood: "new"\|"waxing"\|"full"\|"waning"\|null, clientDraftedAt }` | `Entry` — server stamps `sealedAt`; rejects with `already_sealed_tonight` if one exists |
| `/entries/partner` | GET | — | `{ entries: Entry[] }` — **server-filtered to unlocked only**; locked entries are never sent over the wire, not even hidden in the payload |

`Entry`: `{ id, day, text, mood, sealedAt, unlocksAt }`

### Silent Room & Tonight's Question

| Endpoint | Method | Request | Response |
|---|---|---|---|
| `/silent-room` | GET | — | `{ lines: [{ id, text, postedAt }] }` — cohort-scoped, ≤7 days old, no author data of any kind |
| `/silent-room` | POST | `{ text }` (one per night) | `{ posted: true }` |
| `/tonights-question` | GET | — | `{ prompt, answers: [{ text }], hasAnswered }` |
| `/tonights-question` | POST | `{ text }` | `{ posted: true }` |

### Reveal (Day 21)

| Endpoint | Method | Request | Response |
|---|---|---|---|
| `/reveal` | GET | — | `{ eligible: bool, myChoice: Level\|null, outcome: "pending"\|"mutual"\|"anonymous", revealed: {...}\|null }` |
| `/reveal` | POST | `{ level: Level, contactConfirm?: true }` | same as GET — `contact` level requires the separate `contactConfirm` flag |

`Level`: `"anonymous" | "firstName" | "nameCollege" | "contact"`. The server never discloses who chose what when the outcome is `anonymous`. One "anonymous" keeps both private.

### Safety

| Endpoint | Method | Request | Response |
|---|---|---|---|
| `/safety/report` | POST | `{ targetType: "partner"\|"silentRoomLine"\|"tqAnswer", targetId?, reason, detail? }` | `{ reportId }` — enters the human review queue + admin daily digest |
| `/safety/block` | POST | `{ }` (blocks current partner) | `{ blocked: true, matchState: MatchState }` — immediate, no timer |

Crisis: any entry/line POST may return `200` with an additional `{ crisis: { helplines: [...] } }` field when the keyword scan flags content. The entry is always still saved ("Your entry was still saved. You're not alone."). The client shows the resources screen; it never blocks the write.

### Push & events

| Endpoint | Method | Request | Response |
|---|---|---|---|
| `/push/register` | POST | `{ fcmToken, platform: "android" }` | `{ registered: true }` |
| `/push/register` | DELETE | `{ fcmToken }` | `{ removed: true }` |
| `/events` | POST | `{ name, properties?, occurredAt }` | `204` — first-party funnel events only (signup, scan_complete, matched, d1_seal, d7_active, d21_complete, reveal_choice) |

## Notification types (server-sent, for reference)

`midnight_unlock`, `nudge_9pm`, `match_found`, `day20`, `partner_fading`, `safety`. Cap: 2/day, safety exempt. Full policy in SYSTEMS.md. The client never schedules local notifications that imitate these.
