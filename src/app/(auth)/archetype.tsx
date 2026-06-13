import { router } from 'expo-router';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { copy } from '@/copy';

/**
 * Archetype reveal. Skeleton only: the full-screen reveal moment and share
 * card arrive in step 4.2. From here the journey enters the match ceremony.
 */
export default function Archetype() {
  return (
    <Screen title={copy.nav.archetypeTitle} centered>
      <Button label={copy.nav.continue} onPress={() => router.replace('/match-ceremony')} />
    </Screen>
  );
}
