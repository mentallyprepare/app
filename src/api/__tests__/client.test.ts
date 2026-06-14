import { ApiClient } from '../client';
import type { Transport, TransportRequest } from '../transport';
import { ApiError } from '../types';

/** A transport that records requests instead of sending them. */
function spyTransport() {
  const calls: TransportRequest[] = [];
  const transport: Transport = {
    request: async <T>(req: TransportRequest): Promise<T> => {
      calls.push(req);
      return undefined as T;
    },
  };
  return { transport, calls };
}

describe('ApiClient maps each endpoint to exactly one request', () => {
  it('auth & account', async () => {
    const { transport, calls } = spyTransport();
    const c = new ApiClient(transport);
    await c.authSession();
    await c.getMe();
    await c.updateMe({ pseudonym: 'moonfish' });
    await c.exportAccount();
    await c.deleteAccount();
    expect(calls).toEqual([
      { method: 'POST', path: '/auth/session', body: {} },
      { method: 'GET', path: '/me' },
      { method: 'PATCH', path: '/me', body: { pseudonym: 'moonfish' } },
      { method: 'GET', path: '/account/export' },
      { method: 'DELETE', path: '/account', body: { confirm: true } },
    ]);
  });

  it('scan & matching', async () => {
    const { transport, calls } = spyTransport();
    const c = new ApiClient(transport);
    await c.scan({ answers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] });
    await c.getMatch();
    await c.rematch({ reason: 'ghosted' });
    expect(calls).toEqual([
      { method: 'POST', path: '/scan', body: { answers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] } },
      { method: 'GET', path: '/match' },
      { method: 'POST', path: '/match/rematch', body: { reason: 'ghosted' } },
    ]);
  });

  it('entries, including the optional day query', async () => {
    const { transport, calls } = spyTransport();
    const c = new ApiClient(transport);
    await c.getEntries();
    await c.getEntries(3);
    await c.postEntry({ text: 'tonight', mood: 'full', clientDraftedAt: '2026-06-14T18:00:00Z' });
    await c.getPartnerEntries();
    expect(calls).toEqual([
      { method: 'GET', path: '/entries' },
      { method: 'GET', path: '/entries?day=3' },
      {
        method: 'POST',
        path: '/entries',
        body: { text: 'tonight', mood: 'full', clientDraftedAt: '2026-06-14T18:00:00Z' },
      },
      { method: 'GET', path: '/entries/partner' },
    ]);
  });

  it('silent room & tonight’s question', async () => {
    const { transport, calls } = spyTransport();
    const c = new ApiClient(transport);
    await c.getSilentRoom();
    await c.postSilentRoomLine({ text: 'still here' });
    await c.getTonightsQuestion();
    await c.postTonightsAnswer({ text: 'an answer' });
    expect(calls).toEqual([
      { method: 'GET', path: '/silent-room' },
      { method: 'POST', path: '/silent-room', body: { text: 'still here' } },
      { method: 'GET', path: '/tonights-question' },
      { method: 'POST', path: '/tonights-question', body: { text: 'an answer' } },
    ]);
  });

  it('reveal', async () => {
    const { transport, calls } = spyTransport();
    const c = new ApiClient(transport);
    await c.getReveal();
    await c.postReveal({ level: 'contact', contactConfirm: true });
    expect(calls).toEqual([
      { method: 'GET', path: '/reveal' },
      { method: 'POST', path: '/reveal', body: { level: 'contact', contactConfirm: true } },
    ]);
  });

  it('safety', async () => {
    const { transport, calls } = spyTransport();
    const c = new ApiClient(transport);
    await c.reportSafety({ targetType: 'partner', reason: 'abuse' });
    await c.blockPartner();
    expect(calls).toEqual([
      { method: 'POST', path: '/safety/report', body: { targetType: 'partner', reason: 'abuse' } },
      { method: 'POST', path: '/safety/block', body: {} },
    ]);
  });

  it('push & events', async () => {
    const { transport, calls } = spyTransport();
    const c = new ApiClient(transport);
    await c.registerPush({ fcmToken: 'tok', platform: 'android' });
    await c.unregisterPush({ fcmToken: 'tok' });
    await c.postEvent({ name: 'd1_seal', occurredAt: '2026-06-14T18:30:00Z' });
    expect(calls).toEqual([
      { method: 'POST', path: '/push/register', body: { fcmToken: 'tok', platform: 'android' } },
      { method: 'DELETE', path: '/push/register', body: { fcmToken: 'tok' } },
      { method: 'POST', path: '/events', body: { name: 'd1_seal', occurredAt: '2026-06-14T18:30:00Z' } },
    ]);
  });
});

describe('ApiError carries the wire code', () => {
  it('keeps code, status, and retryAfterSeconds', () => {
    const err = new ApiError('rate_limited', 'slow down', { status: 429, retryAfterSeconds: 30 });
    expect(err.code).toBe('rate_limited');
    expect(err.status).toBe(429);
    expect(err.retryAfterSeconds).toBe(30);
    expect(err).toBeInstanceOf(Error);
  });
});
