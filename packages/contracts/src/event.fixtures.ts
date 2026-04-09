import { EventData } from './EventData';
import { EventTypes } from './EventTypes';

export function makeEventData(overrides: Partial<EventData> = {}): EventData {
  return {
    type: EventTypes.PAGE_VIEWED,
    emittedAt: new Date('2026-01-01T00:00:00.000Z'),
    properties: { source: 'web', page: '/home' },
    ...overrides,
  } as EventData;
}
