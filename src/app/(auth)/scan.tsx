import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { copy } from '@/copy';

/**
 * ECP-11 scan. Skeleton only: the eleven questions and the "3 of 11" progress
 * arrive in step 4.2. The archetype is computed server-side via /scan.
 */
export default function Scan() {
  return (
    <Screen title={copy.nav.scanTitle} subtitle={copy.nav.scanBody} centered>
      <Button label={copy.nav.continue} onPress={() => router.replace('/archetype')} />
    </Screen>
  );
}
