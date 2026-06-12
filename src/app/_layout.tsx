import {
  PlayfairDisplay_500Medium_Italic,
  PlayfairDisplay_600SemiBold_Italic,
  useFonts,
} from '@expo-google-fonts/playfair-display';
import { DarkTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
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

function TabLayout() {
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
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

export default Sentry.wrap(TabLayout);
