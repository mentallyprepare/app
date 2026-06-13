import { Stack } from 'expo-router';

import { colors } from '@/theme';

/** Onboarding flow: welcome, then the scan, then the archetype reveal. */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    />
  );
}
