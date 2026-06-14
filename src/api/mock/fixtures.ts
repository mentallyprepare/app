import type {
  Entry,
  Helpline,
  MatchState,
  RevealState,
  SilentRoomLine,
  TonightsQuestionResponse,
  User,
} from '../types';

/**
 * Seed data for the mock backend. Everything here is stand-in SERVER/USER
 * content (like rows in a dev database), not the app's UI copy and not final
 * product text. App copy lives in src/copy.ts and is authored separately.
 */

export type Scenario = 'waiting' | 'matched' | 'day21' | 'ghosted';

/** The mock clock's default "now": 21:30 IST on 2026-06-14 (a normal evening). */
export const DEFAULT_NOW = '2026-06-14T16:00:00.000Z';

/** Real Indian crisis lines (BLUEPRINT 5.4), returned in the crisis shape. */
export const HELPLINES: Helpline[] = [
  { name: 'Tele MANAS', phone: '14416' },
  { name: 'iCall', phone: '9152987821' },
  { name: 'Vandrevala Foundation', phone: '18602662345' },
];

/**
 * Keywords the mock "server" flags. Real detection is server-side and far more
 * careful (Hinglish, indirect phrasing); this only exercises the crisis
 * response SHAPE in Phase 3.
 */
export const CRISIS_KEYWORDS = ['hopeless', 'end it', 'cant go on', "can't go on"];

export interface MockState {
  scenario: Scenario;
  user: User;
  matchState: MatchState;
  myEntries: Entry[];
  partnerEntries: Entry[];
  silentRoom: SilentRoomLine[];
  tonightsQuestion: TonightsQuestionResponse;
  reveal: RevealState;
  /** Mock-only: did the partner also choose to reveal? Drives mutuality. */
  partnerRevealed: boolean;
}

function baseUser(overrides: Partial<User>): User {
  return {
    id: 'u_self',
    pseudonym: 'moonfish',
    college: 'Hill College',
    year: '2',
    archetype: 'Protector',
    currentDay: null,
    matchState: 'unmatched',
    notificationPrefs: { nudge: true, nudgeTime: '21:00', unlock: true },
    createdAt: '2026-06-01T12:00:00.000Z',
    ...overrides,
  };
}

const TONIGHTS_QUESTION: TonightsQuestionResponse = {
  prompt: 'What did you not say out loud today?',
  answers: [{ text: 'That I am tired in a way sleep does not fix.' }, { text: 'I almost called someone.' }],
  hasAnswered: false,
};

const SILENT_LINES: SilentRoomLine[] = [
  { id: 'sl_1', text: 'Made it through another one.', postedAt: '2026-06-14T14:00:00.000Z' },
  { id: 'sl_2', text: 'Missing someone who does not miss me.', postedAt: '2026-06-13T20:00:00.000Z' },
];

// Partner's note from last night: unlocksAt is in the past, so it is visible.
const PARTNER_LAST_NIGHT: Entry = {
  id: 'pe_1',
  day: 4,
  text: 'Some days the quiet is heavy. Tonight it is just quiet.',
  mood: 'waning',
  sealedAt: '2026-06-13T15:00:00.000Z',
  unlocksAt: '2026-06-13T18:30:00.000Z',
};

// Partner's note from tonight: unlocksAt is 00:00 IST, so it stays sealed
// until midnight. This is what demonstrates the seal.
const PARTNER_TONIGHT: Entry = {
  id: 'pe_2',
  day: 5,
  text: 'Wrote before I lost my nerve.',
  mood: 'waxing',
  sealedAt: '2026-06-14T15:30:00.000Z',
  unlocksAt: '2026-06-14T18:30:00.000Z',
};

const MY_LAST_NIGHT: Entry = {
  id: 'me_1',
  day: 4,
  text: 'Held it together. Mostly.',
  mood: 'full',
  sealedAt: '2026-06-13T15:10:00.000Z',
  unlocksAt: '2026-06-13T18:30:00.000Z',
};

const noReveal: RevealState = { eligible: false, myChoice: null, outcome: 'pending', revealed: null };

/** Build a fresh state for a scenario. Called on init and on every scenario flip. */
export function buildState(scenario: Scenario): MockState {
  const common = {
    scenario,
    silentRoom: [...SILENT_LINES],
    tonightsQuestion: { ...TONIGHTS_QUESTION, answers: [...TONIGHTS_QUESTION.answers] },
  };

  switch (scenario) {
    case 'waiting':
      return {
        ...common,
        user: baseUser({ currentDay: 1, matchState: 'waiting' }),
        matchState: { status: 'waiting', partner: null, waitingSince: '2026-06-14T10:00:00.000Z' },
        myEntries: [],
        partnerEntries: [],
        reveal: { ...noReveal },
        partnerRevealed: false,
      };
    case 'matched':
      return {
        ...common,
        user: baseUser({ currentDay: 5, matchState: 'matched' }),
        matchState: {
          status: 'matched',
          partner: { archetype: 'Connector', college: 'River College', pairDay: 5, health: 'active' },
          waitingSince: null,
        },
        myEntries: [MY_LAST_NIGHT],
        partnerEntries: [PARTNER_LAST_NIGHT, PARTNER_TONIGHT],
        reveal: { ...noReveal },
        partnerRevealed: false,
      };
    case 'ghosted':
      return {
        ...common,
        user: baseUser({ currentDay: 9, matchState: 'matched' }),
        matchState: {
          status: 'matched',
          partner: { archetype: 'Disconnector', college: 'River College', pairDay: 9, health: 'ghosted' },
          waitingSince: null,
        },
        myEntries: [MY_LAST_NIGHT],
        partnerEntries: [PARTNER_LAST_NIGHT],
        reveal: { ...noReveal },
        partnerRevealed: false,
      };
    case 'day21':
      return {
        ...common,
        user: baseUser({ currentDay: 21, matchState: 'matched' }),
        matchState: {
          status: 'matched',
          partner: { archetype: 'Connector', college: 'River College', pairDay: 21, health: 'active' },
          waitingSince: null,
        },
        myEntries: [MY_LAST_NIGHT],
        partnerEntries: [PARTNER_LAST_NIGHT],
        reveal: { eligible: true, myChoice: null, outcome: 'pending', revealed: null },
        partnerRevealed: true,
      };
  }
}
