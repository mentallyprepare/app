/**
 * Every user-facing string in the app lives here. No inline literals in
 * screens or components, ever (CLAUDE.md). Strings are written by Anushka;
 * anything still wrapped in TODO_ANUSHKA() is a placeholder and must not ship.
 */

/** Marks copy that does not exist yet. Grep for TODO_ANUSHKA before any release. */
export function TODO_ANUSHKA(description: string): string {
  return `[copy needed: ${description}]`;
}

export const copy = {
  today: {
    // From the session brief and the reference register in PRINCIPLES.md.
    prompt: 'What did you not say out loud today?',
    sealButton: "Seal tonight's note",
    sealedReassurance: 'Your words are safe.',

    headline: "It's late, and you're here.",
    writePlaceholder: 'Say it here first.',
    moodQuestion: 'What kind of night is it?',
    // Sits directly above the live countdown to midnight IST.
    countdownLabel: 'Their note opens in',
  },
  moods: {
    // Read left to right under the moons, the arc runs dark to bright to dark.
    new: 'Heavy',
    waxing: 'Lifting',
    full: 'Full',
    waning: 'Fading',
  },
  tabs: {
    today: 'Today',
    silentRoom: 'Silent Room',
    // Label avoids the banned UI noun "journey"; the route keeps its name.
    journey: 'Phases',
    profile: 'You',
  },

  // Skeleton screens introduced in step 3.1 (navigation map). These render
  // structure only; real copy and data arrive when each screen is wired in
  // Phase 4. Most strings are placeholders by design.
  nav: {
    continue: TODO_ANUSHKA('advance button shown on the onboarding screens'),
    welcomeTitle: TODO_ANUSHKA('welcome screen title, the first line a new user reads'),
    welcomeBody: TODO_ANUSHKA('welcome: the four how-it-works lines, as one newline-separated string'),
    signup: TODO_ANUSHKA('welcome: create-account action'),
    login: TODO_ANUSHKA('welcome: sign-in action'),
    scanTitle: TODO_ANUSHKA('ECP-11 scan intro title'),
    scanBody: TODO_ANUSHKA('one line setting up the eleven-question scan, about three minutes'),
    archetypeTitle: TODO_ANUSHKA('archetype reveal screen title'),
    waitingTitle: TODO_ANUSHKA('waiting room title shown while matching'),
    waitingBody: TODO_ANUSHKA('waiting room body: Day 1 counts, write while we find your person'),
    matchTitle: TODO_ANUSHKA('match ceremony modal title, the pairing moment'),
    revealTitle: TODO_ANUSHKA('Day 21 reveal flow title'),
  },

  silentRoom: {
    // Established product line (sacred list #4), safe to ship.
    subtitle: 'No replies. Just witnessed.',
  },

  profile: {
    // Section row labels for the settings screen skeleton.
    notifications: TODO_ANUSHKA('profile row: notification settings'),
    export: TODO_ANUSHKA('profile row: download your data'),
    deleteAccount: TODO_ANUSHKA('profile row: delete account'),
    safety: TODO_ANUSHKA('profile row: safety and crisis resources'),
    devShowcase: 'Theme showcase (dev)',
  },
} as const;

export default copy;
