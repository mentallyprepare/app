import * as Sentry from '@sentry/react-native';

/**
 * Crash reporting only. No analytics SDKs, no tracking (PRINCIPLES.md #11);
 * Sentry is here for crash-free-rate monitoring (BLUEPRINT 6.5, 8.3).
 *
 * The DSN comes from EAS build secrets as EXPO_PUBLIC_SENTRY_DSN.
 * Without it (local dev before the account exists) this is a no-op.
 */
const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

export function initSentry() {
  if (!dsn) {
    return;
  }
  Sentry.init({
    dsn,
    // Crashes and errors only. No session replay, no profiling, no tracing:
    // entry text must never leave the device except to our own API.
    tracesSampleRate: 0,
    enableAutoSessionTracking: true,
    sendDefaultPii: false,
    maxBreadcrumbs: 30,
  });
}

export { Sentry };
