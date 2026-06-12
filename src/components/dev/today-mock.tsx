import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { copy } from '@/copy';
import { MoonFull, MoonNew, MoonWaning, MoonWaxing } from '@/components/icons';
import { colors, radius, spacing, type } from '@/theme';

import { GoldButton } from './gold-button';

/**
 * A mocked, non-functional Today screen composition for the theme showcase.
 * Nothing here talks to an API or owns any state that matters; it exists so
 * the theme can be judged on the screen it will carry most.
 */

const MOODS = [
  { key: 'new', Icon: MoonNew, label: copy.moods.new },
  { key: 'waxing', Icon: MoonWaxing, label: copy.moods.waxing },
  { key: 'full', Icon: MoonFull, label: copy.moods.full },
  { key: 'waning', Icon: MoonWaning, label: copy.moods.waning },
] as const;

export function TodayMock() {
  // No default mood, ever (sacred to the product: the user chooses or doesn't).
  const [mood, setMood] = useState<string | null>(null);

  return (
    <View style={styles.screen}>
      <Text style={styles.headline}>{copy.today.headline}</Text>

      <View style={styles.promptCard}>
        <Text style={styles.prompt}>{copy.today.prompt}</Text>
      </View>

      <View style={styles.writeArea}>
        <Text style={styles.writePlaceholder}>{copy.today.writePlaceholder}</Text>
      </View>

      <Text style={styles.moodQuestion}>{copy.today.moodQuestion}</Text>
      <View style={styles.moodRow}>
        {MOODS.map(({ key, Icon, label }) => {
          const selected = mood === key;
          return (
            <Pressable
              key={key}
              onPress={() => setMood(selected ? null : key)}
              style={[styles.mood, selected && styles.moodSelected]}>
              <Icon size={28} color={selected ? colors.accentRose : colors.inkMuted} />
              <Text style={[styles.moodLabel, selected && styles.moodLabelSelected]} numberOfLines={1}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <GoldButton label={copy.today.sealButton} />

      <Text style={styles.countdown}>
        {copy.today.countdownLabel} <Text style={styles.countdownTime}>04:21:36</Text>
      </Text>
      <Text style={styles.reassurance}>{copy.today.sealedReassurance}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  headline: {
    ...type.display,
    color: colors.inkPrimary,
  },
  promptCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  prompt: {
    ...type.prompt,
    color: colors.accentGold,
  },
  writeArea: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    minHeight: 120,
  },
  writePlaceholder: {
    ...type.body,
    color: colors.inkFaint,
  },
  moodQuestion: {
    ...type.bodySmall,
    color: colors.inkMuted,
  },
  moodRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  mood: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  moodSelected: {
    backgroundColor: colors.surface,
  },
  moodLabel: {
    ...type.caption,
    color: colors.inkFaint,
  },
  moodLabelSelected: {
    color: colors.accentRose,
  },
  countdown: {
    ...type.caption,
    color: colors.inkMuted,
    textAlign: 'center',
  },
  countdownTime: {
    color: colors.inkPrimary,
  },
  reassurance: {
    ...type.caption,
    color: colors.inkFaint,
    textAlign: 'center',
  },
});
