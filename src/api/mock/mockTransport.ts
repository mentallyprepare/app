import { ApiError } from '../types';
import type {
  AccountExport,
  AuthSessionResponse,
  BlockResponse,
  CrisisResources,
  DeleteAccountResponse,
  EntriesResponse,
  Entry,
  MatchState,
  PostEntryRequest,
  PostEntryResponse,
  PostRevealRequest,
  PostSilentRoomRequest,
  PostSilentRoomResponse,
  PostTonightsAnswerRequest,
  PostedResponse,
  RevealState,
  ScanResponse,
  SilentRoomLine,
  UpdateMeRequest,
  User,
} from '../types';
import type { Transport, TransportRequest } from '../transport';
import type { Clock } from './clock';
import { MockClock } from './clock';
import {
  buildState,
  CRISIS_KEYWORDS,
  DEFAULT_NOW,
  HELPLINES,
  type MockState,
  type Scenario,
} from './fixtures';
import { istDateKey, nextMidnightIstUtc } from './ist';

/**
 * A fake /api/v1 backend behind the same Transport the real HttpTransport will
 * implement, so screens never know the difference. It plays the SERVER role on
 * purpose: it owns the clock and computes seal / unlock / day / mutuality, the
 * exact state the client must never derive (PRINCIPLES #2). Swapping this for
 * HttpTransport in Phase 4 is the whole point of the seam.
 */
export class MockTransport implements Transport {
  private state: MockState;

  constructor(
    scenario: Scenario = 'matched',
    private readonly clock: Clock = new MockClock(DEFAULT_NOW),
  ) {
    this.state = buildState(scenario);
  }

  /** Reset to a different scenario with no code edits (the dev switcher). */
  loadScenario(scenario: Scenario): void {
    this.state = buildState(scenario);
  }

  async request<T>(req: TransportRequest): Promise<T> {
    return this.route(req) as T;
  }

  private route(req: TransportRequest): unknown {
    const path = req.path.split('?')[0];
    const key = `${req.method} ${path}`;
    switch (key) {
      case 'POST /auth/session':
        return { user: this.state.user, isNew: false } as AuthSessionResponse;
      case 'GET /me':
        return this.state.user;
      case 'PATCH /me':
        return this.updateMe(req.body as UpdateMeRequest);
      case 'GET /account/export':
        return { user: this.state.user, entries: this.state.myEntries } as AccountExport;
      case 'DELETE /account':
        return { deleted: true } as DeleteAccountResponse;
      case 'POST /scan':
        return this.scan();
      case 'GET /match':
        return this.state.matchState;
      case 'POST /match/rematch':
        return this.rematch();
      case 'GET /entries':
        return this.getEntries(req.path);
      case 'POST /entries':
        return this.postEntry(req.body as PostEntryRequest);
      case 'GET /entries/partner':
        return this.getPartnerEntries();
      case 'GET /silent-room':
        return { lines: this.state.silentRoom };
      case 'POST /silent-room':
        return this.postSilentRoom(req.body as PostSilentRoomRequest);
      case 'GET /tonights-question':
        return this.state.tonightsQuestion;
      case 'POST /tonights-question':
        return this.postTonightsAnswer(req.body as PostTonightsAnswerRequest);
      case 'GET /reveal':
        return this.state.reveal;
      case 'POST /reveal':
        return this.postReveal(req.body as PostRevealRequest);
      case 'POST /safety/report':
        return { reportId: `r_${this.state.myEntries.length + 1}` };
      case 'POST /safety/block':
        return this.block();
      case 'POST /push/register':
        return { registered: true };
      case 'DELETE /push/register':
        return { removed: true };
      case 'POST /events':
        return undefined; // 204 No Content
      default:
        throw new ApiError('not_found', `mock has no handler for ${key}`, { status: 404 });
    }
  }

  private updateMe(patch: UpdateMeRequest): User {
    const u = this.state.user;
    this.state.user = {
      ...u,
      pseudonym: patch.pseudonym ?? u.pseudonym,
      college: patch.college ?? u.college,
      year: patch.year ?? u.year,
      notificationPrefs: { ...u.notificationPrefs, ...(patch.notificationPrefs ?? {}) },
    };
    return this.state.user;
  }

  private scan(): ScanResponse {
    const archetype = this.state.user.archetype ?? 'Protector';
    this.state.user = { ...this.state.user, archetype };
    return { archetype, description: 'You keep the people around you safe, often before yourself.' };
  }

  private rematch(): MatchState {
    // Day count carries over (SYSTEMS); the partner search restarts.
    this.state.matchState = {
      status: 'waiting',
      partner: null,
      waitingSince: this.clock.now().toISOString(),
    };
    this.state.partnerEntries = [];
    return this.state.matchState;
  }

  private getEntries(rawPath: string): EntriesResponse {
    const query = rawPath.split('?')[1] ?? '';
    const day = /(?:^|&)day=(\d+)/.exec(query);
    const entries = day
      ? this.state.myEntries.filter((e) => e.day === Number(day[1]))
      : this.state.myEntries;
    return { entries };
  }

  private postEntry(body: PostEntryRequest): PostEntryResponse {
    const now = this.clock.now();
    const sealedToday = this.state.myEntries.some(
      (e) => istDateKey(new Date(e.sealedAt)) === istDateKey(now),
    );
    if (sealedToday) {
      throw new ApiError('already_sealed_tonight', 'You have already sealed a note tonight.', {
        status: 409,
      });
    }
    const entry: Entry = {
      id: `me_${this.state.myEntries.length + 1}`,
      day: this.state.user.currentDay ?? 1,
      text: body.text,
      mood: body.mood,
      sealedAt: now.toISOString(), // server stamps the seal
      unlocksAt: nextMidnightIstUtc(now).toISOString(), // server computes the unlock
    };
    this.state.myEntries = [...this.state.myEntries, entry];
    const crisis = this.detectCrisis(body.text);
    return crisis ? { ...entry, crisis } : entry;
  }

  private getPartnerEntries(): EntriesResponse {
    if (this.state.matchState.status !== 'matched') {
      throw new ApiError('not_matched', 'You are not matched yet.', { status: 409 });
    }
    const now = this.clock.now().getTime();
    // Server-filtered to unlocked only: locked entries never go over the wire.
    const entries = this.state.partnerEntries.filter(
      (e) => new Date(e.unlocksAt).getTime() <= now,
    );
    return { entries };
  }

  private postSilentRoom(body: PostSilentRoomRequest): PostSilentRoomResponse {
    const line: SilentRoomLine = {
      id: `sl_${this.state.silentRoom.length + 1}`,
      text: body.text,
      postedAt: this.clock.now().toISOString(),
    };
    this.state.silentRoom = [line, ...this.state.silentRoom];
    const crisis = this.detectCrisis(body.text);
    return crisis ? { posted: true, crisis } : { posted: true };
  }

  private postTonightsAnswer(body: PostTonightsAnswerRequest): PostedResponse {
    this.state.tonightsQuestion = {
      ...this.state.tonightsQuestion,
      answers: [{ text: body.text }, ...this.state.tonightsQuestion.answers],
      hasAnswered: true,
    };
    return { posted: true };
  }

  private postReveal(body: PostRevealRequest): RevealState {
    if (!this.state.reveal.eligible) {
      throw new ApiError('entry_locked', 'The reveal is not open yet.', { status: 409 });
    }
    const anonymous = body.level === 'anonymous';
    // The mock owns mutuality: one "anonymous" keeps both private.
    const outcome = anonymous ? 'anonymous' : this.state.partnerRevealed ? 'mutual' : 'pending';
    const revealed =
      outcome === 'mutual' ? { firstName: 'Aanya', college: 'River College' } : null;
    this.state.reveal = { ...this.state.reveal, myChoice: body.level, outcome, revealed };
    return this.state.reveal;
  }

  private block(): BlockResponse {
    this.state.matchState = { status: 'unmatched', partner: null, waitingSince: null };
    this.state.partnerEntries = [];
    return { blocked: true, matchState: this.state.matchState };
  }

  private detectCrisis(text: string): CrisisResources | undefined {
    const lower = text.toLowerCase();
    return CRISIS_KEYWORDS.some((k) => lower.includes(k)) ? { helplines: HELPLINES } : undefined;
  }
}
