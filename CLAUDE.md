# CLAUDE.md — Mentally Prepare App (mentallyprepare/app)

You are building the Android app for Mentally Prepare, an anonymous 21-day writing ritual for Indian college students. The product is live on the web at mymentallyprepare.com with real users. This app is a **native client of the existing backend**. You are not designing a product; you are implementing one that exists.

Read this entire file before writing any code. These rules override your defaults.

---

## The product in five lines

Each user is matched with one anonymous student from another college. Both write one honest note each night. Notes seal until midnight IST, then unlock for the partner. On Day 21, both independently choose whether to reveal who they are. The anonymity is the product; the reveal is the payoff.

---

## Sacred list (never violate, never "improve")

1. **Anonymity first.** No real names, photos, or identity surfaces anywhere before a mutual Day-21 reveal.
2. **The midnight seal is server-enforced.** The client never computes seal state, unlock state, the day counter, or reveal mutuality. It renders what `/api/v1` returns. If you find yourself writing date math for any of these, stop.
3. **No streaks, no gamification, no badges, no points, no confetti.**
4. **No feeds.** The Silent Room is one anonymous line per night, no replies, no likes, gone in 7 days, cohort-scoped. "No replies. Just witnessed."
5. **No astrology.** The night-sky aesthetic is visual atmosphere only. No zodiac, oracles, seasons, or alignments as features.
6. **No AI inside the pair.** No AI-written or AI-suggested replies, no AI companion, no summaries of the partner's words, no writing assistance in the journal. The test for any AI proposal: does it replace a human's presence or protect it? Replacers are rejected.
7. **The four archetypes are exactly:** Protector, Connector, Performer, Disconnector. Never invent variants.
8. **Safety is never paywalled, gated, or removed:** report, block, rematch, crisis resources.
9. **18+ only.**

---

## Voice (every user-facing string)

The voice is a quiet 3am friend. Not a wellness app, not a startup, not a therapist.

- Second person, present tense, emotionally specific. Short sentences.
- Reference register: "What did you not say out loud today?" / "Your words are safe." / "The night passed. Tonight is still yours."
- **Banned words:** sanctuary, oracle, celestial, cosmic (as a label), safe space, journey (as a UI noun), holistic, wellness, vibes, self-care, streak, unlock your potential, gateway.
- **Banned tones:** cheerful-by-default, clinical, corporate, motivational-poster, exclamation marks in notifications.
- No em-dashes in copy. Use a comma, a colon, or a new sentence.
- **You do not author user-facing copy.** All strings live in `src/copy.ts`. If a string you need is missing, add the key with the placeholder `TODO_ANUSHKA("short description of what this moment needs")` and flag it in the PR description. Never ship invented copy.

---

## Architecture

- **Stack:** Expo (React Native) + TypeScript + Expo Router. EAS Build. Sentry for crash reporting.
- **Backend:** existing Express/SQLite server on Railway. The app talks ONLY to `/api/v1/*` JSON endpoints, authenticated with Firebase ID tokens (Bearer header). Never call non-v1 routes; never assume cookies.
- **State:** server state via a typed API client in `src/api/` (single fetch wrapper, token injection, typed responses). Local state with React hooks. No Redux, no extra state libraries without a written case.
- **Offline:** exactly one offline capability exists: tonight's draft persists locally and submits when connectivity returns. The server still decides whether it sealed in time. Build nothing else offline-first.
- **Files:** one screen per file under `app/` (Expo Router convention). No file over 300 lines; split components into `src/components/`. The web repo's 216KB single-file app.js and the prototype's 4,000-line MainActivity are the two cautionary tales this rule exists because of.
- **Theme:** all colors, type, and spacing from `src/theme.ts`. Base #0B0614, gold and rose accents, serif italic display face for headlines. **Never use emoji as icons.** SVG line icons and the moon-phase motif only.
- **Dependencies:** the stack is intentionally minimal. Adding any dependency requires a one-line justification in the PR description.

## API contract

The contract lives in `API.md` at repo root and is the single source of truth. Summary of surfaces: auth/session, me, scan, match (+ /rematch), entries (+ /partner), silent-room, tonights-question, reveal, safety/report, safety/block, push/register, account/export, account (DELETE). If an endpoint you need is missing or returns the wrong shape, do not work around it client-side; flag it in the PR description as a backend request.

## Notifications

Six types only, defined in the notification policy: midnight unlock, 9 PM nudge, match found, Day 20, partner fading notice, safety. Hard cap two pushes per day; safety exempt. Permission is requested after the user's first seal, never at launch. Every notification deep-links to the screen it describes. Do not add notification types.

---

## Workflow discipline

- **One blueprint step per session.** The phase plan lives in BLUEPRINT.md. Work on exactly the step you are asked for. Do not start the next step, do not refactor neighboring code "while you're here."
- **One PR per step.** PR description: what step, what changed, what needs human eyes (copy TODOs, design judgment calls, backend requests).
- **Tests:** every API client function gets a unit test against mocked responses. Seal/unlock rendering logic gets edge tests (11:59 PM IST, partner deleted, no partner yet). CI (typecheck, lint, test) must be green; never weaken CI to pass.
- **Never commit:** secrets, .env files, API keys, hardcoded tokens. Firebase config comes from EAS secrets.
- **Never add:** analytics SDKs (events go to our own /api/v1 events endpoint), ad SDKs, tracking of any kind. The privacy posture is a brand promise.
- **New feature ideas** (yours or anyone's) go in NEXT.md as one-liners, not into code. They are reviewed monthly by the founders.

## Definition of done for any screen

1. Renders real API data and every state: loading, error, empty, and the "partner is quiet" family of states. Silent failures are bugs.
2. Every interactive element has a pressed/disabled/loading state. No dead taps.
3. All strings from copy.ts, no inline literals.
4. Works at 1.3x font scale and passes a contrast check against #0B0614.
5. Tested on the physical budget Android, not just the emulator (flag in PR if you couldn't).
6. Sacred list re-read; nothing on the screen violates it.

---

## Context documents in this repo

- `BLUEPRINT.md` — the 13-week phase plan with exit gates
- `API.md` — endpoint contract (source of truth)
- `PRINCIPLES.md` — the founder-signed sacred list (this file summarizes it; that file wins on conflict)
- `SYSTEMS.md` — partner health states, notification policy, AI boundaries
- `NEXT.md` — parked ideas

When in doubt about a product question, do not guess and do not invent. Ask in the PR description. The founders decide; you implement.
