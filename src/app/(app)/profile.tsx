import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { copy } from '@/copy';
import { spacing } from '@/theme';

/**
 * Settings, safety, export, delete. Rows are skeleton labels for now; each is
 * wired in step 5.6. Safety is never gated or removed.
 *
 * The reveal entry and theme-showcase link here are temporary dev affordances
 * to make the modal routes reachable; in Phase 4 the reveal is reached only
 * when the server says the pair is Day-21 eligible.
 */
export default function Profile() {
  return (
    <Screen title={copy.tabs.profile}>
      <View style={{ gap: spacing.md }}>
        <Button label={copy.profile.notifications} variant="quiet" />
        <Button label={copy.profile.safety} variant="quiet" />
        <Button label={copy.profile.export} variant="quiet" />
        <Button label={copy.profile.deleteAccount} variant="quiet" />
        {__DEV__ ? (
          <>
            <Button
              label={copy.nav.revealTitle}
              variant="quiet"
              onPress={() => router.push('/reveal')}
            />
            <Button
              label={copy.profile.devShowcase}
              variant="quiet"
              onPress={() => router.push('/_dev/theme')}
            />
          </>
        ) : null}
      </View>
    </Screen>
  );
}
