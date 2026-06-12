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

    headline: TODO_ANUSHKA('Today screen headline, the night greeting'),
    writePlaceholder: TODO_ANUSHKA('placeholder inside the write box, invites the first honest sentence'),
    moodQuestion: TODO_ANUSHKA('one quiet line asking how tonight felt, shown above the four moons, no default selected'),
    countdownLabel: TODO_ANUSHKA('label above the countdown to midnight, when the note unlocks for the partner'),
  },
  moods: {
    new: TODO_ANUSHKA('mood label for the new moon, the heaviest night'),
    waxing: TODO_ANUSHKA('mood label for the waxing moon, something easing'),
    full: TODO_ANUSHKA('mood label for the full moon, a full or bright night'),
    waning: TODO_ANUSHKA('mood label for the waning moon, something fading'),
  },
  tabs: {
    today: TODO_ANUSHKA('tab label for the Today screen'),
    silentRoom: TODO_ANUSHKA('tab label for the Silent Room'),
    journey: TODO_ANUSHKA('tab label for the past-entries screen'),
    profile: TODO_ANUSHKA('tab label for settings/profile'),
  },
} as const;

export default copy;
