import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StarFour } from '@/components/icons';
import { colors, spacing, type } from '@/theme';

interface ScreenProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  /** When true, content is vertically centered (onboarding / ceremony moments). */
  centered?: boolean;
}

/**
 * The on-theme shell every screen sits in. One source for safe-area, the night
 * background, the serif title, and consistent padding so individual screen
 * files stay small (CLAUDE.md: no file over 300 lines).
 */
export function Screen({ title, subtitle, children, centered = false }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={[styles.content, centered && styles.centered]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <StarFour size={20} color={colors.accentGold} />
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
    padding: spacing.xl,
    gap: spacing.xl,
  },
  centered: {
    justifyContent: 'center',
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    ...type.display,
    color: colors.inkPrimary,
  },
  subtitle: {
    ...type.body,
    color: colors.inkMuted,
  },
});
