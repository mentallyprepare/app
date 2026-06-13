import {
  PlayfairDisplay_500Medium_Italic,
  PlayfairDisplay_600SemiBold_Italic,
  useFonts,
} from '@expo-google-fonts/playfair-display';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { initSentry, Sentry } from '@/sentry';
import { colors } from '@/theme';

initSentry();
SplashScreen.preventAutoHideAsync();

// The app is one color scheme: the night. No light mode.
const nightTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.surface,
    text: colors.inkPrimary,
    border: colors.border,
    primary: colors.accentGold,
  },
};

function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_500Medium_Italic,
    PlayfairDisplay_600SemiBold_Italic,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={nightTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="match-ceremony" options={{ presentation: 'modal' }} />
        <Stack.Screen name="reveal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}

export default Sentry.wrap(RootLayout);
