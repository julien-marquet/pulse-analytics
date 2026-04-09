import { makeEventData } from '@app/contracts/src/event.fixtures';
import { getDailyEventsStatsUpsertQueries } from './event-persistence.service.helpers';

describe('getDailyEventsStatsUpsertQueries', () => {
  const emittedAt = new Date('2026-04-09T22:00:00.000Z');
  const receivedAt = new Date('2026-04-09T22:00:01.000Z');
  const processedAt = new Date('2026-04-09T22:00:02.000Z');
  const eventData = makeEventData({ emittedAt });

  it('should return one query per timezone', () => {
    const result = getDailyEventsStatsUpsertQueries(
      eventData,
      emittedAt,
      receivedAt,
      processedAt,
      ['UTC', 'America/New_York'],
    );

    expect(result).toHaveLength(2);
  });

  it('should return an empty array when no timezones are provided', () => {
    const result = getDailyEventsStatsUpsertQueries(
      eventData,
      emittedAt,
      receivedAt,
      processedAt,
      [],
    );

    expect(result).toEqual([]);
  });

  it('should set the correct timezone and eventType in where and create', () => {
    const [query] = getDailyEventsStatsUpsertQueries(
      eventData,
      emittedAt,
      receivedAt,
      processedAt,
      ['UTC'],
    );

    expect(query.where.date_eventType_timeZone.timeZone).toBe('UTC');
    expect(query.where.date_eventType_timeZone.eventType).toBe(eventData.type);
    expect(query.create.timeZone).toBe('UTC');
    expect(query.create.eventType).toBe(eventData.type);
  });

  it('should set the date to UTC midnight for the given timezone', () => {
    const [query] = getDailyEventsStatsUpsertQueries(
      eventData,
      emittedAt,
      receivedAt,
      processedAt,
      ['UTC'],
    );

    // 2026-04-09T22:00:00.000Z in UTC → date is 2026-04-09
    expect(query.create.date).toEqual(new Date('2026-04-09T00:00:00.000Z'));
    expect(query.where.date_eventType_timeZone.date).toEqual(
      new Date('2026-04-09T00:00:00.000Z'),
    );
  });

  it('should resolve date to the next day when timezone is ahead of UTC enough to cross midnight', () => {
    // 2026-04-09T22:00:00Z in UTC+3 (Europe/Moscow) is 2026-04-10T01:00:00
    const [query] = getDailyEventsStatsUpsertQueries(
      eventData,
      emittedAt,
      receivedAt,
      processedAt,
      ['Europe/Moscow'],
    );

    expect(query.create.date).toEqual(new Date('2026-04-10T00:00:00.000Z'));
  });

  it('should set count to 1 and processingLatencyTotalMs to processedAt − receivedAt in create', () => {
    const expectedLatency = processedAt.valueOf() - receivedAt.valueOf();

    const [query] = getDailyEventsStatsUpsertQueries(
      eventData,
      emittedAt,
      receivedAt,
      processedAt,
      ['UTC'],
    );

    expect(query.create.count).toBe(1);
    expect(query.create.processingLatencyTotalMs).toBe(expectedLatency);
  });

  it('should increment count and processingLatencyTotalMs in update', () => {
    const expectedLatency = processedAt.valueOf() - receivedAt.valueOf();

    const [query] = getDailyEventsStatsUpsertQueries(
      eventData,
      emittedAt,
      receivedAt,
      processedAt,
      ['UTC'],
    );

    expect(query.update).toEqual({
      count: { increment: 1 },
      processingLatencyTotalMs: { increment: expectedLatency },
    });
  });
});
