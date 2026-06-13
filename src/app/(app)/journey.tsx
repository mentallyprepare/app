import { Screen } from '@/components/screen';
import { copy } from '@/copy';

/**
 * Past entries and moon-phase history. Day 7 and Day 14 beats arrive in step
 * 4.8. The tab label is "Phases" (the banned UI noun "journey" stays out of
 * user-facing copy); the route keeps its name.
 */
export default function Journey() {
  return <Screen title={copy.tabs.journey} />;
}
