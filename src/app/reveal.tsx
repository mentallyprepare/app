import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { copy } from '@/copy';

/**
 * Day-21 reveal flow, a modal. Skeleton only: the four levels, the separate
 * contact confirmation, and the asymmetric outcomes arrive in step 5.2. Reveal
 * mutuality is computed server-side; one "anonymous" keeps both private.
 */
export default function Reveal() {
  return (
    <Screen title={copy.nav.revealTitle} centered>
      <Button label={copy.nav.continue} variant="quiet" onPress={() => router.back()} />
    </Screen>
  );
}
