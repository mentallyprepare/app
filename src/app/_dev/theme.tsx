import { Redirect } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { TodayMock } from '@/components/dev/today-mock';
import {
  JourneyIcon,
  MoonFull,
  MoonNew,
  MoonWaning,
  MoonWaxing,
  ProfileIcon,
  SealIcon,
  SilentRoomIcon,
  StarFour,
  WriteIcon,
} from '@/components/icons';
import { colors, radius, spacing, type } from '@/theme';

/**
 * Dev-only theme showcase: every token, every icon, and a mocked Today
 * composition. Route: /_dev/theme. Not reachable in production builds.
 */

const SWATCHES = Object.entries(colors) as [string, string][];

const TYPE_STYLES = Object.entries(type) as [string, (typeof type)[keyof typeof type]][];

const SPACES = Object.entries(spacing) as [string, number][];

const RADII = Object.entries(radius) as [string, number][];

const ICONS = [
  ['MoonNew', MoonNew],
  ['MoonWaxing', MoonWaxing],
  ['MoonFull', MoonFull],
  ['MoonWaning', MoonWaning],
  ['SealIcon', SealIcon],
  ['WriteIcon', WriteIcon],
  ['SilentRoomIcon', SilentRoomIcon],
  ['JourneyIcon', JourneyIcon],
  ['ProfileIcon', ProfileIcon],
  ['StarFour', StarFour],
] as const;

export default function ThemeShowcase() {
  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.section}>Colors</Text>
      <View style={styles.grid}>
        {SWATCHES.map(([name, hex]) => (
          <View key={name} style={styles.swatchCell}>
            <View style={[styles.swatch, { backgroundColor: hex }]} />
            <Text style={styles.tokenName}>{name}</Text>
            <Text style={styles.tokenValue}>{hex}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.section}>Type</Text>
      {TYPE_STYLES.map(([name, style]) => (
        <View key={name} style={styles.typeRow}>
          <Text style={[style, { color: colors.inkPrimary }]}>{name}</Text>
          <Text style={styles.tokenValue}>
            {style.fontSize}/{style.lineHeight}
          </Text>
        </View>
      ))}

      <Text style={styles.section}>Spacing</Text>
      {SPACES.map(([name, value]) => (
        <View key={name} style={styles.spacingRow}>
          <Text style={styles.tokenName}>
            {name} ({value})
          </Text>
          <View style={[styles.spacingBar, { width: value * 4 }]} />
        </View>
      ))}

      <Text style={styles.section}>Radius</Text>
      <View style={styles.grid}>
        {RADII.map(([name, value]) => (
          <View key={name} style={styles.radiusCell}>
            <View style={[styles.radiusBox, { borderRadius: value }]} />
            <Text style={styles.tokenName}>
              {name} ({value})
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.section}>Icons</Text>
      <View style={styles.grid}>
        {ICONS.map(([name, Icon]) => (
          <View key={name} style={styles.iconCell}>
            <Icon size={28} color={colors.inkPrimary} />
            <Text style={styles.tokenValue}>{name}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.section}>Today, mocked</Text>
      <TodayMock />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
    gap: spacing.md,
  },
  section: {
    ...type.headline,
    color: colors.accentGold,
    marginTop: spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  swatchCell: {
    width: 96,
    gap: spacing.xs,
  },
  swatch: {
    height: 48,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tokenName: {
    ...type.bodySmall,
    color: colors.inkPrimary,
  },
  tokenValue: {
    ...type.caption,
    color: colors.inkMuted,
  },
  typeRow: {
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  spacingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  spacingBar: {
    height: 8,
    backgroundColor: colors.accentRose,
    borderRadius: radius.sm,
  },
  radiusCell: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  radiusBox: {
    width: 64,
    height: 64,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.accentGold,
  },
  iconCell: {
    width: 96,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
});
