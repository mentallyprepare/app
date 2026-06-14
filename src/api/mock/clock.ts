export interface Clock {
  now(): Date;
}

/**
 * A settable clock so tests and the dev scenario switcher can cross midnight
 * IST on demand. The real backend just uses wall-clock time; this stands in.
 */
export class MockClock implements Clock {
  private current: Date;

  constructor(iso: string) {
    this.current = new Date(iso);
  }

  now(): Date {
    return this.current;
  }

  set(iso: string): void {
    this.current = new Date(iso);
  }

  advance(ms: number): void {
    this.current = new Date(this.current.getTime() + ms);
  }
}
