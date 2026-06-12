# Mentally Prepare — Three System Designs

Partner health, notifications, AI boundaries. Grounded in the live product, the June 10 audit, and the brand rules. Each section ends with what to build now vs later. Proposal: Anushka and cofounder decide.

---

## 1. Partner Health & Rematch System

The unit of the product is the pair. One ghost kills two users. The FAQ already promises "if your partner misses 3 days, we'll let you know," so the contract exists; the system behind it doesn't. Design principle: a missed night is grace, not failure, and the loyal partner's words are never wasted.

### States

A pair is always in exactly one state:

| State | Trigger | What the loyal partner sees |
|---|---|---|
| **Active** | Both wrote within last 2 days | Nothing. Health systems should be invisible when healthy |
| **Quiet** | Partner missed 2 consecutive nights | Soft line on Today: "Your person has been quiet for two nights. Sometimes the words don't come. Yours still count." |
| **Fading** | Missed 3 nights (the FAQ threshold) | The promised notice, plus a choice: "Keep writing and wait" / "Find someone who shows up." No countdown pressure, no partner-shaming |
| **Ghosted** | Missed 5 nights or user chose rematch | Warm rematch: "Your words are safe. They stay yours. We're finding someone new; your day count carries over." |
| **Recovered** | Ghost returns before partner rematches | Returning user sees grace, not guilt: "The nights passed. Tonight is still yours." Partner gets the unlock as normal |

### Rules

- **Day count carries over on rematch.** Forcing a restart at Day 1 punishes the victim of the ghost. The new pair syncs to the loyal user's day, and the new partner (likely from the waiting pool or another broken pair) gets a short context note: "They're on Day 9. You're joining their nights."
- **The ghost is not shamed.** If they return, they return to grace copy. If they're rematched away, they quietly go back to the waiting pool with a fresh start. People ghost mental health products because life got heavy, the exact thing the product exists for.
- **Abuse is a different pipe, not a health state.** Report/block already exist on the site and trigger immediate human review. Never let "partner health" copy handle abuse; never let abuse handling wait on a 3-day timer.
- **Both-ghost pairs** (neither wrote for 5 nights) get one re-engagement email each, then the pair dissolves silently. No notification to either.

### Scores (founder-facing only, never user-facing)

Two numbers per pair, computed nightly in SQL, shown only in the admin panel:

- **Pair health**: nights both wrote / nights elapsed. Below 0.5 by Day 7 predicts death; that's the cohort to watch.
- **Match liquidity**: current waiting-pool size and median wait time. This is the number that decides campus-deep seeding, and it gates the "usually within 24 hours" promise.

No ML, no "match quality score" at this scale. With 63 users, every score a model could produce, Anushka can see by reading the admin panel. Revisit at 5,000 users.

### Build order

Now (website, this is Bucket B in the v1 plan and it ships before the app): the 3-day notice verified end to end, the Quiet and Fading copy, the rematch choice, day-count carryover. Later (1,000+ users): auto-rematch logic, both-ghost dissolution automation, liquidity dashboard.

---

## 2. Notification Policy

The voice is a quiet 3am friend. A 3am friend does not ping you four times a day. Every notification must pass one test: **is this a gift or a demand?** Gifts get sent. Demands get cut.

### The canon (complete list, in priority order)

1. **Midnight unlock** — "Their note from last night is open." The reward notification, the retention engine. If only one notification can be reliable, it's this one. Send between 12:05 and 8:00 AM IST, batched to arrive when the phone wakes.
2. **9 PM nudge** — the writing reminder. One line, rotating, emotionally specific, never generic. Good: "What did you not say out loud today?" Banned: "Don't break your streak!", "We miss you!", anything with an exclamation mark.
3. **Match found** — the ceremony moment. Sent once, whenever it happens.
4. **Day 20** — "Tomorrow you both choose." Sent once per journey.
5. **Partner notices** — the Fading notice (state machine above). Rare by design.
6. **Safety** — report outcomes, crisis resources. Always delivered, never batched, exempt from every cap below.

That is the entire list. Six types. Anything else needs a written case for why it's a gift.

### Hard rules

- **Cap: maximum 2 push notifications per day** (the 9 PM nudge + at most one other). Safety exempt.
- **Quiet hours: nothing between 1 AM and 12:05 AM unlock window logic aside, no marketing-style sends ever.** No "we've been thinking about you" re-engagement push. Lapsed users get one email at Day 3-5 of silence (infra exists), and then they are left alone. Being left alone respectfully is on-brand.
- **No notification before first value.** Permission is asked after the first seal, when the midnight mechanic gives the permission prompt its reason: "Turn on notifications so you know when their note opens."
- **Every notification deep-links to the exact screen it describes.** Unlock → partner's note. Nudge → tonight's prompt.
- **User control is three toggles, not ten:** the nudge (with time picker, default 9 PM), the unlock, everything else. Safety cannot be toggled off.
- **Channel ladder:** push first; email only for account/safety and the single lapse message; in-app for everything ambient (Quiet state line lives in the UI, not in a push).

### Fatigue prevention

One mechanism, no system needed at this scale: if a user hasn't opened the app in 7 days, all push stops except safety. The product's stance is that silence is an acceptable answer. This is also the cheapest possible fatigue system: it's one WHERE clause.

### Build order

Now: midnight unlock + 9 PM nudge verified end to end on Android (audit item 35, still open). Next: match-found and Day 20 (both are copy + one cron check). Later: the 7-day silence rule, toggle UI.

---

## 3. AI Boundary Policy

The product's entire premise is that the thing on the other side is a real human who chose to show up. AI anywhere near that premise is poison. But the founder uses AI heavily to build, and a cofounder arriving via AI Studio will propose AI features. So the boundary gets written down now, before the first argument.

### Where AI must never exist (the hard wall)

1. **Inside the pair.** No AI-written replies, no AI "companion" fallback when a partner ghosts, no AI-suggested responses, no AI summary of the partner's note. The moment a user wonders "did a human write this?", the product is dead. This includes "just while they wait for a match." Especially then.
2. **Inside the user's own writing.** No autocomplete, no tone suggestions, no "improve my entry." The friction of finding your own words is the product.
3. **Reflection summaries and emotional insights.** "Your mood improved 23% this week" and AI-generated pattern readings are pseudo-clinical claims the product is not qualified to make (same reason the audit flags archetype over-claiming). Mood data can be shown as raw, honest visualization (the moon-phase history), never as AI interpretation.
4. **Anything resembling therapy.** No AI check-ins, no coping suggestions, no "it sounds like you're feeling…" The site already says "not clinical care" and means it.
5. **Marketing pretending to be human.** No AI-written "from Anushka" notes. The founder note works because it's real.

### Where AI is acceptable (the narrow gate)

1. **Crisis detection assist, behind the curtain.** The current keyword scan misses Hinglish and indirect phrasing (audit, known failure mode). An LLM classifier as a second-pass flag, feeding the same human review queue, raises recall without making any user-facing claim. The user-facing behavior is unchanged: helplines + "your entry was still saved." This is the single highest-value AI application in the company.
2. **Moderation triage for Silent Room reports**, same pattern: AI ranks the human's queue, human decides. Never auto-removal.
3. **Founder tooling.** Prompt drafting, code, content batches, admin digest summaries. Invisible to users, unrestricted.
4. **Matching, conditionally and silently.** If archetype-complement matching ever needs more signal at scale, an embedding of scan answers is acceptable because matching is already algorithmic and makes no humanity claim. Never marketed as "AI matching."

### The test for future proposals

Ask one question: **does this AI replace a human's presence, or protect it?** Protectors (crisis recall, moderation triage) pass. Replacers (companions, replies, summaries, insights) fail, no matter how good the demo feels. Write this sentence into the cofounder agreement next to the sacred list: anonymity, the seal, no streaks, no feed, no astrology, no AI inside the pair.

### Build order

Now: nothing. The keyword scan + human review stands. Next (before batch 3, when volume grows): the Hinglish crisis classifier as second-pass flag. Later: moderation triage when Silent Room volume justifies it.

---

*All three systems assume the funnel events are firing. They are designed to be measured: pair health distribution, notification opt-in and open rates, crisis flag recall. Deploy item7-analytics-funnel.patch first or all of this runs blind.*
