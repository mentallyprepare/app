import { ApiClient } from '../client';
import { MockClock } from './clock';
import { DEFAULT_NOW, type Scenario } from './fixtures';
import { MockTransport } from './mockTransport';

export type { Scenario } from './fixtures';

/** Shared mock clock for the dev session. */
export const mockClock = new MockClock(DEFAULT_NOW);

/** Singleton mock transport + client the Phase 3 screens consume. */
export const mockTransport = new MockTransport('matched', mockClock);
export const mockClient = new ApiClient(mockTransport);

/** Flip the demo scenario at runtime, no code edits (waiting/matched/day21/ghosted). */
export function setScenario(scenario: Scenario): void {
  mockTransport.loadScenario(scenario);
}

/** A fresh, isolated client + its clock, for tests. */
export function createMockClient(scenario: Scenario = 'matched', iso: string = DEFAULT_NOW) {
  const clock = new MockClock(iso);
  return { client: new ApiClient(new MockTransport(scenario, clock)), clock };
}
