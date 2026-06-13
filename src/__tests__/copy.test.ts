import { copy } from '@/copy';

/**
 * Voice guards from CLAUDE.md. These run against every string in copy.ts
 * that is real (not a TODO_ANUSHKA placeholder).
 */

const BANNED_WORDS = [
  'sanctuary',
  'oracle',
  'celestial',
  'safe space',
  'holistic',
  'wellness',
  'vibes',
  'self-care',
  'streak',
  'unlock your potential',
  'gateway',
];

function leafStrings(node: unknown, path = ''): [string, string][] {
  if (typeof node === 'string') return [[path, node]];
  if (node && typeof node === 'object') {
    return Object.entries(node).flatMap(([key, value]) =>
      leafStrings(value, path ? `${path}.${key}` : key)
    );
  }
  return [];
}

const all = leafStrings(copy);
const real = all.filter(([, text]) => !text.startsWith('[copy needed:'));

describe('copy voice rules', () => {
  it('has at least the founder-authored strings', () => {
    expect(real.length).toBeGreaterThan(0);
  });

  it.each(real)('"%s" contains no banned vocabulary', (_path, text) => {
    const lower = text.toLowerCase();
    for (const word of BANNED_WORDS) {
      expect(lower).not.toContain(word);
    }
  });

  it.each(real)('"%s" contains no em-dash', (_path, text) => {
    expect(text).not.toContain('—');
  });

  it('every key is a non-empty string', () => {
    for (const [path, text] of all) {
      if (text.length === 0) {
        throw new Error(`empty copy at ${path}`);
      }
    }
  });
});
