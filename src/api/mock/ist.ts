/**
 * IST date math. This is the *mock server's* logic, the role the real
 * Express/SQLite backend plays in production. It lives behind the Transport on
 * purpose: the client and screens never compute seal / unlock / day
 * (PRINCIPLES #2). The mock owns it so Phase 3 can demo real server-owned
 * behavior, and Phase 4 deletes it by swapping in HttpTransport.
 */

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

/** The UTC instant of the next midnight IST strictly after `now`. */
export function nextMidnightIstUtc(now: Date): Date {
  const ist = new Date(now.getTime() + IST_OFFSET_MS);
  const nextDayMidnightIstWall = Date.UTC(
    ist.getUTCFullYear(),
    ist.getUTCMonth(),
    ist.getUTCDate() + 1,
    0,
    0,
    0,
    0,
  );
  return new Date(nextDayMidnightIstWall - IST_OFFSET_MS);
}

/** YYYY-MM-DD of an instant in IST, for "same night" comparisons. */
export function istDateKey(d: Date): string {
  return new Date(d.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}
