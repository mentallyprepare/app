/**
 * The single source for all visual tokens. No raw hex, font names, sizes,
 * or spacing values anywhere else in the codebase.
 *
 * Contrast ratios against colors.bg (#0B0614), WCAG:
 *   inkPrimary 16.51:1 (AAA)   inkMuted 7.78:1 (AAA)
 *   inkFaint 3.64:1 — large text (>=18pt) and disabled states only
 *   accentGold 10.11:1         accentRose 7.90:1
 *   inkOnGold on accentGold 8.16:1
 */

export const colors = {
  /** The night. Base of every screen. */
  bg: '#0B0614',
  /** Cards, sealed notes, input fields. One step out of the dark. */
  surface: '#150E22',
  /** Raised elements on a surface: modals, the active tab. */
  surfaceRaised: '#1E1532',
  /** Hairlines and card borders. Barely there. */
  border: '#2A2140',

  /** Headlines' company: the seal, the partner's presence. */
  accentGold: '#D9B36C',
  /** Dark end of the gold gradient. */
  accentGoldDeep: '#B98E3F',
  /** The quieter, warmer accent: mood, tenderness. */
  accentRose: '#D98E9C',
  /** Dark end of the rose gradient. Large text and fills only (4.76:1). */
  accentRoseDeep: '#B36476',

  /** Primary text. */
  inkPrimary: '#EDE7F4',
  /** Secondary text, timestamps, helper lines. */
  inkMuted: '#A79DBA',
  /** Disabled states and large quiet text only. Fails AA at body size. */
  inkFaint: '#6E6485',
  /** Text set on a gold fill (the seal button). */
  inkOnGold: '#2A1F0E',
} as const;

/** Gradient stops. Use with expo-linear-gradient or Svg gradients. */
export const gradients = {
  gold: [colors.accentGold, colors.accentGoldDeep] as const,
  rose: [colors.accentRose, colors.accentRoseDeep] as const,
} as const;

/**
 * Playfair Display italic carries every headline; body text is the platform
 * sans (Roboto on Android) for rendering quality at small sizes.
 * Font files load in the root layout via expo-font; these names must match.
 */
export const fonts = {
  display: 'PlayfairDisplay_500Medium_Italic',
  displayStrong: 'PlayfairDisplay_600SemiBold_Italic',
  body: undefined, // platform default sans
} as const;

export const type = {
  /** Screen-level headline. Serif italic. */
  display: { fontFamily: fonts.display, fontSize: 32, lineHeight: 40 },
  /** Section headline. Serif italic. */
  headline: { fontFamily: fonts.display, fontSize: 24, lineHeight: 31 },
  /** The nightly prompt. Serif italic, between headline and body. */
  prompt: { fontFamily: fonts.display, fontSize: 20, lineHeight: 28 },
  /** Card titles, button labels. Sans. */
  title: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22, fontWeight: '600' as const },
  /** Body text, the writing itself. Sans. */
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  /** Secondary lines. Sans. */
  bodySmall: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  /** Timestamps, counters, whispers. Sans. */
  caption: { fontFamily: fonts.body, fontSize: 12, lineHeight: 16 },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 999,
} as const;

/** Default stroke width for all line icons. Single weight, everywhere. */
export const iconStroke = 1.5;

export const theme = { colors, gradients, fonts, type, spacing, radius, iconStroke } as const;
export default theme;
