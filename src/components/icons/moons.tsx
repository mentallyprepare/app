import Svg, { Circle, Path } from 'react-native-svg';

import { colors, iconStroke } from '@/theme';

import type { IconProps } from './types';

/**
 * The four moon phases. The only mood vocabulary in the product:
 * new, waxing, full, waning. Line icons, one stroke weight.
 */

export function MoonNew({ size = 24, color = colors.inkMuted, strokeWidth = iconStroke }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

export function MoonWaxing({ size = 24, color = colors.inkMuted, strokeWidth = iconStroke }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={strokeWidth} />
      {/* terminator bows left; the sliver of light grows on the right */}
      <Path
        d="M12 3 C 7.5 7, 7.5 17, 12 21"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function MoonFull({ size = 24, color = colors.inkMuted, strokeWidth = iconStroke }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={strokeWidth} fill={color} />
    </Svg>
  );
}

export function MoonWaning({ size = 24, color = colors.inkMuted, strokeWidth = iconStroke }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={strokeWidth} />
      {/* terminator bows right; the light recedes to the left */}
      <Path
        d="M12 3 C 16.5 7, 16.5 17, 12 21"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}
