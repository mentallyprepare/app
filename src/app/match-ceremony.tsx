import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { copy } from '@/copy';

/**
 * The pairing moment, a full-screen modal. Skeleton only: the partner archetype
 * in gold and "21 nights start now" arrive in step 4.4. Dismissing enters the
 * matched loop.
 */
export default function MatchCeremony() {
  return (
    <Screen title={copy.nav.matchTitle} centered>
      <Button label={copy.nav.continue} onPress={() => router.replace('/today')} />
    </Screen>
  );
}
