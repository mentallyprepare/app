# Mentally Prepare — App Building Operation Blueprint

Step-by-step, two people, ~13 weeks. The app is a native client of the existing Express/SQLite backend at mymentallyprepare.com. Nothing in the loop logic gets rebuilt; it gets exposed and consumed. The AI Studio prototype is a design reference only.

How to read this: every phase has steps, an owner (A = Anushka, C = Cofounder, B = both), and an exit gate. Do not start a phase until the previous gate passes. The website track runs in parallel and is listed last, but its Phase W1 happens before everything.

---

## Phase 0 — Decisions (3 days, B)

**Step 0.1 — Stack decision by experiment, not debate.** Cofounder builds one polished screen (the Today screen, from the prototype's design) in Expo/React Native in 48 hours. If it's clean and they're comfortable, the stack is Expo. If they fight the tooling, run the same test in Capacitor wrapping the existing web app. Whichever ships the screen wins. This blueprint assumes **Expo**; every step maps 1:1 to Capacitor except Phase 3.

**Step 0.2 — Sign the sacred list.** One page, both signatures, lives in the repo root as PRINCIPLES.md: anonymity first, the midnight seal is server-enforced, no streaks, no feeds, no astrology, no AI inside the pair, the four archetypes (Protector / Connector / Performer / Disconnector), the 3am-friend voice, safety is never paywalled. Any feature that violates it needs both founders to amend the file first.

**Step 0.3 — Split the roles.** A: backend, API, copy, brand, batches, Play Store listing. C: app client, CI, QA tooling. Both: weekly metric review (Monday, 30 min), weekly build review (Friday, 30 min). Write it in PRINCIPLES.md.

**Step 0.4 — Repos.** Create `mentallyprepare/app` (new repo). Protect main on BOTH repos today (Settings → Branches → require PR review; 15 minutes, already overdue on the web repo). Add cofounder to the org.

**Exit gate:** stack chosen, PRINCIPLES.md merged, both mains protected.

---

## Phase 1 — Foundation Week (Week 1)

### Backend prep (A)

**Step 1.1 — Survival trio.** Verify backup.js runs on schedule, ships off-box, and restore-test it once into a scratch DB. Verify SMTP on prod (send a real reset email). Confirm SESSION_SECRET is a permanent Railway variable. (~3 hours, existential.)

**Step 1.2 — Deploy the five pending patches** (signup-login, today-countdown, mood-no-default, analytics-funnel, silent-presence). Retest each on the live site. The analytics patch is the one nothing else can wait for.

**Step 1.3 — Dedup the four doubled functions** in app.js (renderPast, renderTabs, renderTQTabs, toggleNotifications). Delete the dead diverged copies.

**Step 1.4 — Smoke tests on the two hearts.** Write 8-10 tests: matching (pairs correctly, respects preferences, no self-match, no double-match) and seal/unlock (entry invisible before midnight IST, visible after, timezone edge at 11:59). Wire into the existing GitHub Actions CI. These tests protect every backend change the app will force.

### App prep (C)

**Step 1.5 — Scaffold.** `npx create-expo-app`, TypeScript, Expo Router. Set up EAS Build (free tier), get a dev build running on a real budget Android phone (buy one if needed, ~₹10k, it's the QA fleet).

**Step 1.6 — Theme first.** Port the design system before any screen: colors (#0B0614 base, gold/rose accents), Playfair Display for headlines (or licensed equivalent), type scale, spacing, the moon-phase mood icons as SVGs. No emoji as icons anywhere. This is where the prototype's art direction gets salvaged.

**Step 1.7 — CI.** GitHub Action on the app repo: typecheck, lint, unit tests on PR. Sentry (free tier) wired into both the app skeleton AND the Express server (the audit flags zero error tracking; one hook fixes both worlds).

**Exit gate:** backups restore-tested, patches live, funnel events visible in analytics_events table, app dev build runs on the physical phone, CI green on both repos.

---

## Phase 2 — API Layer (Weeks 2-3, A)

The web app talks to Express via session cookies and some HTML assumptions. The app needs a clean JSON surface. Don't rewrite routes; wrap and version them.

**Step 2.1 — Mount `/api/v1/`.** New Express router. Existing logic gets called by thin v1 handlers that guarantee JSON in/out. Web keeps using current routes untouched; zero regression risk.

**Step 2.2 — Token auth.** Firebase Auth is already integrated for Google OAuth. Extend it: app clients authenticate with Firebase ID tokens (email/password + Google, both supported by Firebase), verified by the existing Admin SDK in middleware. Sessions stay for web; tokens for app. One user table, two front doors.

**Step 2.3 — The endpoint contract.** Document in `app/API.md` as you build:

| Endpoint | Method | Purpose |
|---|---|---|
| /api/v1/auth/session | POST | Exchange Firebase ID token for user profile |
| /api/v1/me | GET/PATCH | Profile, preferences, day count |
| /api/v1/scan | POST | Submit ECP-11 answers → archetype |
| /api/v1/match | GET | Match state (waiting / matched / partner archetype / pair health state) |
| /api/v1/match/rematch | POST | Request rematch (ghost recovery) |
| /api/v1/entries | GET/POST | My entries; create tonight's note (server stamps seal time) |
| /api/v1/entries/partner | GET | Partner entries, server-filtered to unlocked only |
| /api/v1/silent-room | GET/POST | Tonight's lines (cohort-scoped), post one line |
| /api/v1/tonights-question | GET/POST | Prompt + community answers |
| /api/v1/reveal | GET/POST | Day-21 state, submit reveal choice |
| /api/v1/safety/report | POST | Report content/partner |
| /api/v1/safety/block | POST | Block partner |
| /api/v1/push/register | POST | Register FCM device token |
| /api/v1/account/export | GET | Data download |
| /api/v1/account | DELETE | Account deletion (Play Store requires this) |

Rule: **the seal, the unlock, the day counter, and reveal mutuality are computed server-side only.** The client renders state; it never owns it. (The prototype's client-side "Sync Current Day" button is the cautionary tale.)

**Step 2.4 — FCM fan-out.** Add `device_tokens` table. Server-side send via firebase-admin (already a dependency) for the six canonical notifications (see notification policy doc). Web Push code stays for PWA users; one internal `notify(user, type, payload)` function fans out to both.

**Step 2.5 — Rate limiting on v1** (reuse existing middleware) + request logging to Sentry.

**Exit gate:** Postman/Bruno collection runs the full journey against staging-on-prod data (test account): auth → scan → match → write → seal → unlock → reveal. Smoke tests from 1.4 still green.

---

## Phase 3 — App Skeleton (Weeks 2-4, C, parallel with Phase 2)

**Step 3.1 — Navigation map.** Expo Router file tree, built against mocked API responses until Phase 2 lands:

```
(auth)/welcome      — how-it-works (4 lines) + login/signup
(auth)/scan         — ECP-11, progress "3 of 11", ~3 min estimate
(auth)/archetype    — full-screen reveal + share card
(app)/today         — the core screen: prompt, write, mood, seal, countdown, partner state
(app)/silent-room   — one line, witnessed, gone in 7 days
(app)/journey       — past entries, day markers, moon-phase history
(app)/profile       — settings, notification toggles, export, delete, safety links
match-ceremony      — modal, full-screen pairing moment
reveal              — Day-21 flow, four levels, separate contact confirmation
```

**Step 3.2 — API client.** Typed fetch wrapper, Firebase auth token injection, offline queue for one thing only: tonight's draft (written offline, sealed when connectivity returns; the server still stamps seal validity).

**Step 3.3 — Copy pass.** Every string in the skeleton comes from a single `copy.ts` file, written by A, not generated. The web app's existing copy is the source. No string ships that A hasn't read. This is how the voice survives a second author.

**Exit gate:** full journey clickable on the phone with mocked data, copy file reviewed, design matches theme spec.

---

## Phase 4 — Core Loop, Live (Weeks 4-7, C builds, A supports API fixes)

Wire each screen to the real API in journey order, one PR per screen, A reviews every PR for voice and loop correctness:

- **4.1** Auth + welcome (Google + email, password reset via existing SMTP flow)
- **4.2** ECP-11 scan → archetype reveal (full-screen moment, the share card can stub)
- **4.3** Waiting room ("Your Day 1 counts. Write while we find your person.") + Tonight's Question available immediately
- **4.4** Match ceremony (partner archetype in gold, "21 nights start now")
- **4.5** Today: write → mood (no default) → seal (first-seal explainer teaches midnight) → countdown
- **4.6** Midnight unlock: partner note rendering + the FCM unlock notification end to end
- **4.7** Silent Room (cohort rules, no replies)
- **4.8** Journey/history + Day 7 and Day 14 beats (Day 7 replays the user's own Day 1 line)

**Step 4.9 — Notification verification ritual.** Every Friday build review: trigger 9 PM nudge and midnight unlock on the physical phone, doze mode on. Push that isn't verified weekly is push that's broken.

**Exit gate:** both founders complete a real 3-day mini-journey as a matched pair on dev builds, every notification arriving on time.

---

## Phase 5 — The Differentiators (Weeks 7-9, B)

This is the audit's retention work, the reason the app will outperform the website:

- **5.1** Ghost recovery: Quiet / Fading / Ghosted states from the partner-health doc, rematch flow with day-count carryover (server logic A, screens C)
- **5.2** Day 20 notification + Day 21 reveal flow: four levels, separate confirmation for contact details, asymmetric outcomes handled gracefully, contact-reveal safety line ("Meet in public. You can still block here.")
- **5.3** Archetype share card: beautiful, anonymous, Instagram-story sized, the one growth artifact
- **5.4** Crisis surfaces: keyword flag → helplines screen (Tele MANAS, iCall, Vandrevala) + "Your entry was still saved. You're not alone." Same pipeline as web, same admin review
- **5.5** Report / block / rematch in profile and on partner content (Play Store UGC policy requires this for approval, it is not optional)
- **5.6** Settings: three notification toggles, data export, account deletion (Play Store requirement), privacy policy link

**Exit gate:** the sacred list audit. Both founders walk every screen against PRINCIPLES.md and the banned-vocabulary list. Any violation blocks beta.

---

## Phase 6 — QA (Weeks 10-11, C leads)

- **6.1** Device matrix: the budget Android (primary), one mid-range, one small-screen (<5.5"), Android 10 through 15. Emulators don't count for push, doze, or keyboard behavior.
- **6.2** The destructive checklist: kill app mid-write (draft survives), airplane mode seal (queues, seals honestly), clock set forward (server rejects fake midnight), reinstall (account recovery works), two devices one account, partner deletes account mid-journey (loyal partner gets ghost recovery, not a crash).
- **6.3** Accessibility hour: contrast check on the muted-ink-on-#0B0614 palette, font scaling at 1.3x, TalkBack on the core write flow.
- **6.4** Closed beta: 15-20 users recruited from the website waitlist via EAS internal distribution or Play internal testing track. They run a real 21-day journey. Yes, this means the beta is three weeks of calendar time; weeks 12-13 overlap with it.
- **6.5** Beta instrumentation: the six funnel events (signup → scan → match → D1 → D7 → D21 → reveal) firing from the app into the same analytics_events table, plus Sentry crash-free rate.

**Exit gate:** crash-free sessions >99%, every destructive test passes, at least one beta pair past Day 7 with both active.

---

## Phase 7 — Play Store (Weeks 12-13, A)

- **7.1** Play Console account ($25, do it week 1 actually, identity verification can take days).
- **7.2** Listing: screenshots from the real app, the description in the brand voice, "Built by Anushka Kumar" up front (named-human trust). Honest category: Lifestyle or Social, not Health, to avoid medical-app scrutiny the product correctly disclaims.
- **7.3** Data safety form: the privacy posture is a genuine asset, declare it accurately (data collected: email, college, entries; encrypted in transit; deletable in-app; no ads, no data sale, no tracking SDKs).
- **7.4** UGC policy compliance statement: report + block + moderation review exist (they do, after 5.5). 18+ stated in listing and enforced at signup (existing checkbox + listing age rating via content questionnaire).
- **7.5** Required links: privacy policy URL (update privacy.html to mention the app and SQLite while you're there, audit item), account-deletion URL or in-app path.
- **7.6** Submit to closed testing track first, then production with staged rollout: 10% → 50% → 100% over a week, watching Sentry between stages.
- **7.7** Expect one rejection. Mental-health-adjacent + UGC + anonymous messaging gets extra review. Respond with the safety documentation (crisis pipeline, moderation, 18+, block/report). Budget a week for the loop.

**Exit gate:** app live on Play Store.

---

## Phase 8 — Launch Ops (Week 13+, ongoing)

- **8.1** Switch the funnel: site CTA becomes "Get the app", web signup stays as fallback. OG tags, Instagram bio, WhatsApp share links all point to the Play listing.
- **8.2** Launch batch: one campus, seeded deep (the audit's liquidity strategy), recruited via the existing Instagram + the archetype share card.
- **8.3** Monitoring stack, all free tier: Sentry (crashes both sides), UptimeRobot on /api/ready, the admin daily digest email (reports + crisis flags, the one-human-pipeline net), Play Console vitals weekly.
- **8.4** Release cadence: one app release every 2 weeks maximum. Mobile releases are slow (review + staged rollout), so the backend carries hotfixes; that's the advantage of server-owned logic.
- **8.5** Support loop: in-app "something's wrong" mail link → shared inbox → triaged in Monday review.
- **8.6** The Monday metric review reads five numbers: new signups, scan completion, D1/D7 pair activity, Day-21 completion + reveal rate, crash-free rate. The reveal rate is still the company's only proof-of-life number. The app exists to move it.

---

## Parallel Website Track (A, ~half a day per week after Week 1)

- **W1 (before everything):** Phase 1 steps 1.1-1.4 above.
- **W2:** Collapse the double landing page ("Begin tonight" → signup directly). Fix OG/Twitter domain (Railway URL leak). Cite or cut the stats.
- **W3+:** Run batch 2 on the web. Its job: produce the first real Day-21 completion + reveal rate while the app is being built, test the ghost-notice and beat copy the app will inherit, and collect the first consented testimonials.
- **Freeze rule:** no new web features after W2. Fixes only. Every loop improvement goes to the app.

---

## Risks and their tripwires

1. **Prototype gravity.** If anyone proposes "let's just continue from the AI Studio code," the answer is the PeerMatcher.kt docstring. Design reference only.
2. **Scope creep via cofounder energy.** New feature ideas go to a NEXT.md file, reviewed monthly, never mid-phase. The sacred list gates everything.
3. **The 13 weeks becoming 26.** Tripwire: if Phase 4 isn't done by end of week 8, cut Phase 5 to items 5.1, 5.2, 5.5, 5.6 (ghost recovery, reveal, safety, settings) and ship without the share card and beats. The loop ships complete or nothing ships.
4. **Founder burnout on double duty.** A is running batches, backend, copy, and Play Store. If the Monday review keeps slipping, that's the signal to cut scope, not sleep.
5. **Beta says the loop doesn't retain.** If batch 2 (web) and the app beta both show pairs dying by Day 7 with healthy push and ghost recovery in place, stop and rethink the product, not the platform. That's not failure; that's the cheapest possible place to learn it.

---

*Step 1.2 is still the first move, same as it was before the app existed. Everything in this blueprint measures against numbers that patch creates.*
