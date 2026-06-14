import type { Transport } from './transport';
import type {
  AccountExport,
  AuthSessionResponse,
  BlockResponse,
  DeleteAccountResponse,
  EntriesResponse,
  EventRequest,
  MatchState,
  PostedResponse,
  PostEntryRequest,
  PostEntryResponse,
  PostRevealRequest,
  PostSilentRoomRequest,
  PostSilentRoomResponse,
  PostTonightsAnswerRequest,
  PushRegisterRequest,
  PushRegisterResponse,
  PushUnregisterRequest,
  PushUnregisterResponse,
  RematchRequest,
  ReportRequest,
  ReportResponse,
  RevealState,
  ScanRequest,
  ScanResponse,
  SilentRoomResponse,
  TonightsQuestionResponse,
  UpdateMeRequest,
  User,
} from './types';

/**
 * The single typed door every screen uses. One method per /api/v1 endpoint,
 * each a thin pass-through to the Transport. No business logic, no date math,
 * no derivation of seal / unlock / day / pair-health / reveal state — the
 * client renders server-owned state, it never computes it (PRINCIPLES #2).
 */
export class ApiClient {
  constructor(private readonly transport: Transport) {}

  // --- Auth & account ---

  authSession() {
    return this.transport.request<AuthSessionResponse>({
      method: 'POST',
      path: '/auth/session',
      body: {},
    });
  }

  getMe() {
    return this.transport.request<User>({ method: 'GET', path: '/me' });
  }

  updateMe(patch: UpdateMeRequest) {
    return this.transport.request<User>({ method: 'PATCH', path: '/me', body: patch });
  }

  exportAccount() {
    return this.transport.request<AccountExport>({ method: 'GET', path: '/account/export' });
  }

  deleteAccount() {
    return this.transport.request<DeleteAccountResponse>({
      method: 'DELETE',
      path: '/account',
      body: { confirm: true },
    });
  }

  // --- Scan & matching ---

  scan(req: ScanRequest) {
    return this.transport.request<ScanResponse>({ method: 'POST', path: '/scan', body: req });
  }

  getMatch() {
    return this.transport.request<MatchState>({ method: 'GET', path: '/match' });
  }

  rematch(req: RematchRequest) {
    return this.transport.request<MatchState>({
      method: 'POST',
      path: '/match/rematch',
      body: req,
    });
  }

  // --- Entries (the loop) ---

  getEntries(day?: number) {
    const path = day === undefined ? '/entries' : `/entries?day=${day}`;
    return this.transport.request<EntriesResponse>({ method: 'GET', path });
  }

  postEntry(req: PostEntryRequest) {
    return this.transport.request<PostEntryResponse>({ method: 'POST', path: '/entries', body: req });
  }

  getPartnerEntries() {
    return this.transport.request<EntriesResponse>({ method: 'GET', path: '/entries/partner' });
  }

  // --- Silent Room & Tonight's Question ---

  getSilentRoom() {
    return this.transport.request<SilentRoomResponse>({ method: 'GET', path: '/silent-room' });
  }

  postSilentRoomLine(req: PostSilentRoomRequest) {
    return this.transport.request<PostSilentRoomResponse>({
      method: 'POST',
      path: '/silent-room',
      body: req,
    });
  }

  getTonightsQuestion() {
    return this.transport.request<TonightsQuestionResponse>({
      method: 'GET',
      path: '/tonights-question',
    });
  }

  postTonightsAnswer(req: PostTonightsAnswerRequest) {
    return this.transport.request<PostedResponse>({
      method: 'POST',
      path: '/tonights-question',
      body: req,
    });
  }

  // --- Reveal (Day 21) ---

  getReveal() {
    return this.transport.request<RevealState>({ method: 'GET', path: '/reveal' });
  }

  postReveal(req: PostRevealRequest) {
    return this.transport.request<RevealState>({ method: 'POST', path: '/reveal', body: req });
  }

  // --- Safety ---

  reportSafety(req: ReportRequest) {
    return this.transport.request<ReportResponse>({
      method: 'POST',
      path: '/safety/report',
      body: req,
    });
  }

  blockPartner() {
    return this.transport.request<BlockResponse>({ method: 'POST', path: '/safety/block', body: {} });
  }

  // --- Push & events ---

  registerPush(req: PushRegisterRequest) {
    return this.transport.request<PushRegisterResponse>({
      method: 'POST',
      path: '/push/register',
      body: req,
    });
  }

  unregisterPush(req: PushUnregisterRequest) {
    return this.transport.request<PushUnregisterResponse>({
      method: 'DELETE',
      path: '/push/register',
      body: req,
    });
  }

  postEvent(req: EventRequest) {
    return this.transport.request<void>({ method: 'POST', path: '/events', body: req });
  }
}
