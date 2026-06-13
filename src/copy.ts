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
} as const;

export default copy;
