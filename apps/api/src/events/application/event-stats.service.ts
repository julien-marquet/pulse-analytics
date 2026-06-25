import { Inject, Injectable } from '@nestjs/common';
import { TypedConfigService } from '@app/common';
import { ConfigVariables } from '../../config';
import {
  DAILY_EVENT_STATS_READ_MODEL,
  StatsQuery,
  type DailyEventStatsReadModel,
} from './daily-event-stats.read-model';
import { weightedStats } from '../../utils/aggregate.utils';
import { EVENT_FINDER, type EventFinder } from './event.finder';

export const DEFAULT_NUMBER_OF_TOP_EVENTS = 3;

@Injectable()
export class EventsStatsService {
  constructor(
    @Inject(EVENT_FINDER) private readonly eventFinder: EventFinder,
    @Inject(DAILY_EVENT_STATS_READ_MODEL)
    private readonly dlyStatsReadModel: DailyEventStatsReadModel,
    private readonly config: TypedConfigService<ConfigVariables>,
  ) {}

  public getTimeZones() {
    return this.config.get('TIMEZONES');
  }

  async getStatsByDay(query: StatsQuery) {
    return this.dlyStatsReadModel.groupByDay(query);
  }

  public async getStatsOverview(
    query: StatsQuery,
    nSelectedTopEvents: number = DEFAULT_NUMBER_OF_TOP_EVENTS,
  ) {
    const [latestEmittedAt, byType] = await Promise.all([
      this.eventFinder.findLatestEmittedAt(query.from, query.to),
      this.dlyStatsReadModel.groupByType(query),
    ]);

    const { average: averageProcessingLatencyMs, totalWeight: totalEvents } =
      weightedStats(
        byType,
        (i) => i.count,
        (i) => i.processingLatencyTotalMs,
      );

    return {
      totalEvents,
      averageProcessingLatencyMs,
      eventTypesCount: byType.length,
      topEventTypes: byType
        .slice(0, nSelectedTopEvents)
        .map((r) => ({ eventType: r.eventType, count: r.count ?? 0 })),
      latestEventAt: latestEmittedAt?.toISOString(),
    };
  }

  async getStatsByType(query: StatsQuery) {
    const rows = await this.dlyStatsReadModel.groupByType(query);
    let total = 0;
    const types = rows.map((r) => {
      total += r.count;
      return { eventType: r.eventType, count: r.count };
    });
    return { total, types };
  }
}
