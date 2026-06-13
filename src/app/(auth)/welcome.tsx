import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { copy } from '@/copy';
import { spacing } from '@/theme';

export default function Welcome() {
  return (
    <Screen title={copy.nav.welcomeTitle} subtitle={copy.nav.welcomeBody} centered>
      <View style={{ gap: spacing.md }}>
        <Button label={copy.nav.signup} onPress={() => router.push('/scan')} />
        <Button label={copy.nav.login} variant="quiet" onPress={() => router.push('/scan')} />
      </View>
    </Screen>
  );
}
