/**
 * API contract types, transcribed 1:1 from API.md. This file is the typed
 * mirror of the /api/v1 surface: shapes only, no logic.
 *
 * Server-owned state the client renders but NEVER computes (API.md /
 * PRINCIPLES #2): sealedAt, unlocksAt, currentDay, pairDay, pair health,
 * reveal outcome, Silent Room expiry.
 *
 * Times are ISO 8601 UTC strings; the server owns all IST midnight logic.
 */

// --- Shared enums / unions ---

export type Archetype = 'Protector' | 'Connector' | 'Performer' | 'Disconnector';

export type Mood = 'new' | 'waxing' | 'full' | 'waning';

export type MatchStatus = 'unmatched' | 'waiting' | 'matched';

export type PairHealth = 'active' | 'quiet' | 'fading' | 'ghosted';

export type RevealLevel = 'anonymous' | 'firstName' | 'nameCollege' | 'contact';

export type RevealOutcome = 'pending' | 'mutual' | 'anonymous';

export type RematchReason = 'ghosted' | 'unsafe' | 'other';

export type ReportTargetType = 'partner' | 'silentRoomLine' | 'tqAnswer';

export type NotificationType =
  | 'midnight_unlock'
  | 'nudge_9pm'
  | 'match_found'
  | 'day20'
  | 'partner_fading'
  | 'safety';

/** Error codes the client must handle (API.md). */
export type ApiErrorCode =
  | 'unauthorized'
  | 'not_matched'
  | 'already_sealed_tonight'
  | 'entry_locked'
  | 'rate_limited'
  | 'crisis_resources';

// --- Error shape ---

/** The wire shape of an error body. */
export interface ApiErrorBody {
  error: { code: ApiErrorCode | string; message: string };
}

/** Thrown by a Transport on any non-2xx response. */
export class ApiError extends Error {
  readonly code: ApiErrorCode | string;
  readonly status?: number;
  /** Present on rate_limited (429). */
  readonly retryAfterSeconds?: number;

  constructor(
    code: ApiErrorCode | string,
    message: string,
    opts?: { status?: number; retryAfterSeconds?: number },
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = opts?.status;
    this.retryAfterSeconds = opts?.retryAfterSeconds;
  }
}

// --- User & account ---

export interface NotificationPrefs {
  nudge: boolean;
  /** 24h "HH:MM", default "21:00". */
  nudgeTime: string;
  unlock: boolean;
}

/**
 * Match preferences. API.md lists `matchPrefs?` on PATCH /me without fixing its
 * shape; kept open until the backend defines it (flagged in PR).
 */
export interface MatchPrefs {
  [key: string]: unknown;
}

export interface User {
  id: string;
  pseudonym: string;
  college: string;
  // Year shape is unconfirmed in API.md (string vs number); flagged in PR.
  year: string;
  archetype: Archetype | null;
  /** Server-owned. The client never computes the day counter. */
  currentDay: number | null;
  matchState: MatchStatus;
  notificationPrefs: NotificationPrefs;
  createdAt: string;
}

export interface AuthSessionResponse {
  user: User;
  isNew: boolean;
}

export interface UpdateMeRequest {
  pseudonym?: string;
  college?: string;
  year?: string;
  gender?: string;
  matchPrefs?: MatchPrefs;
  notificationPrefs?: Partial<NotificationPrefs>;
}

/** Full user-data export blob; the server's shape, treated opaquely. */
export type AccountExport = Record<string, unknown>;

export interface DeleteAccountResponse {
  deleted: true;
}

// --- Scan & matching ---

export interface ScanRequest {
  /** Exactly 11 ECP-11 answers. */
  answers: number[];
}

export interface ScanResponse {
  archetype: Archetype;
  description: string;
}

export interface MatchPartner {
  archetype: Archetype;
  /** College name only, never identity. */
  college: string;
  /** Server-owned pair day counter. */
  pairDay: number;
  health: PairHealth;
}

export interface MatchState {
  status: MatchStatus;
  partner: MatchPartner | null;
  waitingSince: string | null;
}

export interface RematchRequest {
  reason: RematchReason;
}

// --- Entries (the loop) ---

export interface Entry {
  id: string;
  day: number;
  text: string;
  mood: Mood | null;
  /** Server-stamped seal time. The client never fakes a seal. */
  sealedAt: string;
  /** Server-computed unlock time (midnight IST). */
  unlocksAt: string;
}

export interface EntriesResponse {
  entries: Entry[];
}

export interface PostEntryRequest {
  text: string;
  mood: Mood | null;
  /** Client clock, advisory only; the server decides the real seal time. */
  clientDraftedAt: string;
}

/** A single crisis helpline. Element shape not fixed in API.md; refine later. */
export interface Helpline {
  name: string;
  phone?: string;
  url?: string;
}

/** Crisis resources may ride along on any entry/line POST (API.md). */
export interface CrisisResources {
  helplines: Helpline[];
}

/** A created entry, optionally with crisis resources attached. */
export type PostEntryResponse = Entry & { crisis?: CrisisResources };

// --- Silent Room & Tonight's Question ---

export interface SilentRoomLine {
  id: string;
  text: string;
  postedAt: string;
}

export interface SilentRoomResponse {
  lines: SilentRoomLine[];
}

export interface PostSilentRoomRequest {
  text: string;
}

export interface PostSilentRoomResponse {
  posted: true;
  crisis?: CrisisResources;
}

export interface TonightsQuestionAnswer {
  text: string;
}

export interface TonightsQuestionResponse {
  prompt: string;
  answers: TonightsQuestionAnswer[];
  hasAnswered: boolean;
}

export interface PostTonightsAnswerRequest {
  text: string;
}

export interface PostedResponse {
  posted: true;
}

// --- Reveal (Day 21) ---

/**
 * Revealed identity, shown only on a mutual reveal and populated by the agreed
 * Level. Shape inferred (API.md leaves `revealed` open); refine with backend.
 */
export interface RevealedIdentity {
  firstName?: string;
  college?: string;
  contact?: string;
}

export interface RevealState {
  eligible: boolean;
  myChoice: RevealLevel | null;
  outcome: RevealOutcome;
  /** Null unless the outcome is a mutual reveal. */
  revealed: RevealedIdentity | null;
}

export interface PostRevealRequest {
  level: RevealLevel;
  /** Required when level is 'contact'. */
  contactConfirm?: true;
}

// --- Safety ---

export interface ReportRequest {
  targetType: ReportTargetType;
  targetId?: string;
  reason: string;
  detail?: string;
}

export interface ReportResponse {
  reportId: string;
}

export interface BlockResponse {
  blocked: true;
  matchState: MatchState;
}

// --- Push & events ---

export interface PushRegisterRequest {
  fcmToken: string;
  platform: 'android';
}

export interface PushRegisterResponse {
  registered: true;
}

export interface PushUnregisterRequest {
  fcmToken: string;
}

export interface PushUnregisterResponse {
  removed: true;
}

export interface EventRequest {
  /** First-party funnel events only (signup, scan_complete, …). */
  name: string;
  properties?: Record<string, unknown>;
  occurredAt: string;
}
