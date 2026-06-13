import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing, type } from '@/theme';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  /** 'primary' is the gold-bordered action; 'quiet' is a low-emphasis link. */
  variant?: 'primary' | 'quiet';
  disabled?: boolean;
}

/**
 * The secondary / navigation button. The gold-gradient seal button is its own
 * thing (a ritual, not a CTA) and lives separately; this is for moving between
 * screens. Every interactive element has pressed and disabled states.
 */
export function Button({ label, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.quiet,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <Text style={[styles.label, variant === 'quiet' && styles.labelQuiet]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    borderWidth: 1,
    borderColor: colors.accentGold,
  },
  quiet: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.35,
  },
  label: {
    ...type.title,
    color: colors.accentGold,
  },
  labelQuiet: {
    color: colors.inkMuted,
  },
});
