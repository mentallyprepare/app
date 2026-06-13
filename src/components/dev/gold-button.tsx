import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { gradients, colors, radius, spacing, type } from '@/theme';

/**
 * The gold-gradient action button (dev showcase version).
 * Uses react-native-svg for the gradient so no extra dependency is needed;
 * if a production button needs more, propose expo-linear-gradient in that PR.
 */
export function GoldButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={gradients.gold[0]} />
            <Stop offset="1" stopColor={gradients.gold[1]} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" rx={radius.full} fill="url(#gold)" />
      </Svg>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: radius.full,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  labelRow: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  label: {
    ...type.title,
    color: colors.inkOnGold,
  },
});
