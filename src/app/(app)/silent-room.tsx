import { Screen } from '@/components/screen';
import { copy } from '@/copy';

/**
 * One anonymous line per night, cohort-scoped, gone in 7 days. No replies, no
 * likes, no feed. Wired to /silent-room in step 4.7.
 */
export default function SilentRoom() {
  return <Screen title={copy.tabs.silentRoom} subtitle={copy.silentRoom.subtitle} />;
}
