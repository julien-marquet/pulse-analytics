import { DatePrismaConverter } from '@app/common';
import { DailyEventStat, Event } from '@app/database';

export function makeDailyStatDbEntry(
  overrides: Partial<DailyEventStat>,
): DailyEventStat {
  return {
    date: DatePrismaConverter.toPrisma('2000-01-01'),
    timeZone: 'UTC',
    processingLatencyTotalMs: 0,
    ...overrides,
  } as DailyEventStat;
}
export function makeEventDbEntry(overrides: Partial<Event>): Event {
  return {
    id: 'ID',
    type: 'TYPE',
    emittedAt: new Date(),
    receivedAt: new Date(),
    processedAt: new Date(),
    properties: {},
    ...overrides,
  };
}
