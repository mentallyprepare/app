import { Redirect } from 'expo-router';

/**
 * Entry point. Until auth and server state exist (Phase 4), the app always
 * opens on welcome. The real decision (welcome vs the matched loop) will be
 * driven by /api/v1/me once that lands; the client never owns that state.
 */
export default function Index() {
  return <Redirect href="/welcome" />;
}
