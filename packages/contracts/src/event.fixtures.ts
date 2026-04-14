import { EventData } from './EventData';

export function makeEventData(overrides: Partial<EventData> = {}): EventData {
  return {
    type: 'page-viewed',
    emittedAt: new Date('2026-01-01T00:00:00.000Z'),
    properties: {},
    ...overrides,
  };
}
