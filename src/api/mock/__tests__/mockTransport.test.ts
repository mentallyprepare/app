import { createMockClient } from '../scenarios';

describe('mock backend: seal and unlock are server-owned', () => {
  it('hides the partner’s tonight note before midnight IST, shows it after', async () => {
    // 18:29:00Z = 23:59 IST. The partner's tonight note unlocks at 00:00 IST.
    const { client, clock } = createMockClient('matched', '2026-06-14T18:29:00.000Z');
    let partner = await client.getPartnerEntries();
    expect(partner.entries.map((e) => e.id)).toEqual(['pe_1']); // only last night

    clock.set('2026-06-14T18:30:00.000Z'); // 00:00 IST, the seal opens
    partner = await client.getPartnerEntries();
    expect(partner.entries.map((e) => e.id)).toEqual(['pe_1', 'pe_2']);
  });

  it('stamps sealedAt and unlocksAt itself; ignores the client clock', async () => {
    const { client } = createMockClient('matched', '2026-06-14T16:00:00.000Z');
    const entry = await client.postEntry({
      text: 'tonight',
      mood: 'waxing',
      clientDraftedAt: '1999-01-01T00:00:00.000Z', // bogus client time, must be ignored
    });
    expect(entry.sealedAt).toBe('2026-06-14T16:00:00.000Z');
    expect(entry.unlocksAt).toBe('2026-06-14T18:30:00.000Z'); // next midnight IST
  });

  it('rejects a second seal the same night', async () => {
    const { client } = createMockClient('matched', '2026-06-14T16:00:00.000Z');
    await client.postEntry({ text: 'first', mood: 'full', clientDraftedAt: '2026-06-14T16:00:00.000Z' });
    await expect(
      client.postEntry({ text: 'second', mood: 'new', clientDraftedAt: '2026-06-14T16:05:00.000Z' }),
    ).rejects.toMatchObject({ code: 'already_sealed_tonight' });
  });
});

describe('mock backend: match states', () => {
  it('returns not_matched for partner entries while waiting', async () => {
    const { client } = createMockClient('waiting');
    await expect(client.getPartnerEntries()).rejects.toMatchObject({ code: 'not_matched' });
  });

  it('flips scenario with no code edits', async () => {
    const { client: waiting } = createMockClient('waiting');
    expect((await waiting.getMatch()).status).toBe('waiting');

    const { client: ghosted } = createMockClient('ghosted');
    expect((await ghosted.getMatch()).partner?.health).toBe('ghosted');
  });
});

describe('mock backend: crisis and reveal shapes', () => {
  it('attaches crisis resources without blocking the write', async () => {
    const { client } = createMockClient('matched', '2026-06-14T16:00:00.000Z');
    const entry = await client.postEntry({
      text: 'I feel hopeless tonight',
      mood: 'new',
      clientDraftedAt: '2026-06-14T16:00:00.000Z',
    });
    expect(entry.id).toBeDefined(); // entry still saved
    expect(entry.crisis?.helplines[0].name).toBe('Tele MANAS');
  });

  it('one anonymous keeps both private', async () => {
    const { client } = createMockClient('day21');
    const r = await client.postReveal({ level: 'anonymous' });
    expect(r.outcome).toBe('anonymous');
    expect(r.revealed).toBeNull();
  });

  it('mutual reveal returns the identity', async () => {
    const { client } = createMockClient('day21');
    const r = await client.postReveal({ level: 'nameCollege' });
    expect(r.outcome).toBe('mutual');
    expect(r.revealed?.firstName).toBeDefined();
  });
});

describe('mock backend: drives the full journey', () => {
  it('auth → scan → match → seal → unlock → reveal', async () => {
    const { client, clock } = createMockClient('day21', '2026-06-14T16:00:00.000Z');

    const session = await client.authSession();
    expect(session.user.id).toBeDefined();

    const scan = await client.scan({ answers: Array(11).fill(3) });
    expect(['Protector', 'Connector', 'Performer', 'Disconnector']).toContain(scan.archetype);

    expect((await client.getMatch()).status).toBe('matched');

    const entry = await client.postEntry({
      text: 'a true thing',
      mood: 'full',
      clientDraftedAt: '2026-06-14T16:00:00.000Z',
    });
    expect(entry.sealedAt).toBeDefined();

    clock.set('2026-06-16T00:00:00.000Z'); // well past unlock
    expect((await client.getPartnerEntries()).entries.length).toBeGreaterThan(0);

    const reveal = await client.postReveal({ level: 'firstName' });
    expect(reveal.outcome).toBe('mutual');
  });
});
