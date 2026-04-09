import { EventData } from '@app/contracts';
import { getUTCMidnightForTimezone } from '@app/common';

export function getDailyEventsStatsUpsertQueries(
  eventData: EventData,
  emittedAt: Date,
  receivedAt: Date,
  processedAt: Date,
  timezones: string[],
) {
  const queries = [];

  const jobProcessingLatency = processedAt.valueOf() - receivedAt.valueOf();

  for (const timezone of timezones) {
    const dayDateInTimezone = getUTCMidnightForTimezone(emittedAt, timezone);
    queries.push({
      where: {
        date_eventType_timeZone: {
          timeZone: timezone,
          date: dayDateInTimezone,
          eventType: eventData.type,
        },
      },
      create: {
        timeZone: timezone,
        eventType: eventData.type,
        count: 1,
        date: dayDateInTimezone,
        processingLatencyTotalMs: jobProcessingLatency,
      },
      update: {
        count: { increment: 1 },
        processingLatencyTotalMs: { increment: jobProcessingLatency },
      },
    });
  }
  return queries;
}
