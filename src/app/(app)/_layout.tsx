import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import {
  JourneyIcon,
  ProfileIcon,
  SealIcon,
  SilentRoomIcon,
  type IconProps,
} from '@/components/icons';
import { copy } from '@/copy';
import { colors, spacing } from '@/theme';

type TabIcon = (props: IconProps) => React.JSX.Element;

// The tab bar hands us a ColorValue; our tints are always theme strings.
function icon(Glyph: TabIcon) {
  function TabBarIcon({ color }: { color: ColorValue }) {
    return <Glyph size={24} color={color as string} />;
  }
  return TabBarIcon;
}

/** The four nightly surfaces. Tab labels and icons only; no streak counters. */
export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accentGold,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingTop: spacing.xs,
          paddingBottom: spacing.sm,
        },
      }}>
      <Tabs.Screen
        name="today"
        options={{ title: copy.tabs.today, tabBarIcon: icon(SealIcon) }}
      />
      <Tabs.Screen
        name="silent-room"
        options={{ title: copy.tabs.silentRoom, tabBarIcon: icon(SilentRoomIcon) }}
      />
      <Tabs.Screen
        name="journey"
        options={{ title: copy.tabs.journey, tabBarIcon: icon(JourneyIcon) }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: copy.tabs.profile, tabBarIcon: icon(ProfileIcon) }}
      />
    </Tabs>
  );
}
