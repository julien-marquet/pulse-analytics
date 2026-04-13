import { countDistinctValueOfField } from '../../utils/collection.utils';
import { type DailyEventStat as DbDailyEventStat } from '@app/database';

export function BuildStatsOverview(
  entries: DbDailyEventStat[],
  latestEventAt: Date | undefined,
) {
  return {
    totalEvents: entries.reduce((acc, entry) => {
      return acc + entry.count;
    }, 0),
    averageProcessingLatencyMs: SumAverageProcessingLatency(entries),
    eventTypesCount: countDistinctValueOfField(entries, 'eventType'),
    topEventTypes: GetTopEventTypes(entries, 3),
    latestEventAt: latestEventAt?.toISOString(),
  };
}

export function SumAverageProcessingLatency(dbStats: DbDailyEventStat[]) {
  console.log(dbStats);
  let count = 0;
  let averagesSum = 0;

  dbStats.forEach((stat) => {
    count += stat.count;
    averagesSum += stat.processingLatencyTotalMs;
  });

  console.log(averagesSum / count);

  return count === 0 ? null : averagesSum / count;
}

export function GetTopEventTypes(
  dbStats: DbDailyEventStat[],
  selectionSize: number,
) {
  const eventTypesTotals = dbStats.reduce<Record<string, number>>(
    (acc, curr) => {
      if (acc[curr.eventType] === undefined) {
        acc[curr.eventType] = curr.count;
      } else {
        acc[curr.eventType] += curr.count;
      }
      return acc;
    },
    {},
  );

  return Object.entries(eventTypesTotals)
    .sort(([_, aCount], [__, bCount]) => {
      return bCount - aCount;
    })
    .slice(0, selectionSize)
    .map(([eventType, count]) => ({ eventType, count }));
}
