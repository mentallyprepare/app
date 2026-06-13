import { colors } from '@/theme';

/** WCAG relative luminance and contrast ratio. */
function luminance(hex: string): number {
  const c = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(c.substring(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('theme contrast against the night background', () => {
  // Definition of done #4: passes a contrast check against #0B0614.
  it.each([
    ['inkPrimary', colors.inkPrimary, 7],
    ['inkMuted', colors.inkMuted, 4.5],
    ['accentGold', colors.accentGold, 4.5],
    ['accentRose', colors.accentRose, 4.5],
  ])('%s meets at least %f:1 on bg', (_name, hex, minimum) => {
    expect(contrast(hex, colors.bg)).toBeGreaterThanOrEqual(minimum as number);
  });

  it('inkOnGold is readable on the gold fill', () => {
    expect(contrast(colors.inkOnGold, colors.accentGold)).toBeGreaterThanOrEqual(4.5);
  });

  it('surfaces stay darker than the inks they carry', () => {
    expect(contrast(colors.inkPrimary, colors.surface)).toBeGreaterThanOrEqual(7);
    expect(contrast(colors.inkMuted, colors.surfaceRaised)).toBeGreaterThanOrEqual(4.5);
  });
});
