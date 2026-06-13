import { Screen } from '@/components/screen';
import { copy } from '@/copy';

/**
 * The core screen. The real composition (prompt, write, mood, seal, countdown,
 * partner state) is mocked in the dev theme showcase today; it gets wired to
 * /entries and /tonights-question in step 4.5. The client never computes the
 * seal, the day counter, or unlock state.
 */
export default function Today() {
  return <Screen title={copy.today.headline} subtitle={copy.today.prompt} />;
}
