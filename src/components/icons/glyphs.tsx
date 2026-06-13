import Svg, { Circle, Path } from 'react-native-svg';

import { colors, iconStroke } from '@/theme';

import type { IconProps } from './types';

/** Four-pointed star. The night-sky motif, atmosphere only. */
export function StarFour({ size = 24, color = colors.inkMuted, strokeWidth = iconStroke }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4 L13.8 10.2 L20 12 L13.8 13.8 L12 20 L10.2 13.8 L4 12 L10.2 10.2 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** The seal: a wax-seal circle with the star pressed into it. */
export function SealIcon({ size = 24, color = colors.inkMuted, strokeWidth = iconStroke }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M12 7.5 L13.1 10.9 L16.5 12 L13.1 13.1 L12 16.5 L10.9 13.1 L7.5 12 L10.9 10.9 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Writing: a plain pen. */
export function WriteIcon({ size = 24, color = colors.inkMuted, strokeWidth = iconStroke }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 20 L5 16 L16.5 4.5 a2.12 2.12 0 0 1 3 3 L8 19 L4 20 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path d="M15 6 L18 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

/** The Silent Room: witnessed, not answered. */
export function SilentRoomIcon({ size = 24, color = colors.inkMuted, strokeWidth = iconStroke }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2.8 12 C 5.8 6.8, 18.2 6.8, 21.2 12 C 18.2 17.2, 5.8 17.2, 2.8 12 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={2.5} stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

/** The journey: a path of nights, a small light at the end. */
export function JourneyIcon({ size = 24, color = colors.inkMuted, strokeWidth = iconStroke }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4.5 20.5 C 4.5 13, 19 17.5, 19 9.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Circle cx={4.5} cy={20.5} r={1.4} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M19 3.5 V 7 M17.25 5.25 H 20.75" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

/** Profile. A person, no face, no identity. */
export function ProfileIcon({ size = 24, color = colors.inkMuted, strokeWidth = iconStroke }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8.5} r={3.5} stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M5 19.5 C 6.5 15.5, 17.5 15.5, 19 19.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}
