export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export interface TransportRequest {
  method: HttpMethod;
  /** Path under the /api/v1 base, e.g. '/me' or '/entries?day=3'. */
  path: string;
  body?: unknown;
}

/**
 * The seam between the typed ApiClient and the outside world. Phase 3 ships a
 * MockTransport (fixtures + a mock clock); Phase 4 swaps in an HttpTransport
 * (real fetch to /api/v1 with a Firebase bearer token). Screens never see this,
 * they only ever hold an ApiClient, so Phase 4 is a swap, not a rewrite.
 *
 * Implementations own: the base URL, JSON encode/decode, the Authorization
 * header, and throwing ApiError (code / status / retryAfterSeconds) on non-2xx.
 * They never compute server-owned state (seal, unlock, day, health, reveal).
 */
export interface Transport {
  request<T>(req: TransportRequest): Promise<T>;
}
