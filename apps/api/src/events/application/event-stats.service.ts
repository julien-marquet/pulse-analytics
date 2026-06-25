import { Inject, Injectable } from '@nestjs/common';
import { TypedConfigService } from '@app/common';
import { ConfigVariables } from '../../config';
import {
  EVENT_STATS_READER,
  StatsQuery,
  type EventStatsReader,
} from './event-stats.reader';
import { weightedStats } from '../../utils/aggregate.utils';
import { EVENT_READER, type EventReader } from './event.reader';

@Injectable()
export class EventsStatsService {
  constructor(
    @Inject(EVENT_READER) private readonly eventReader: EventReader,
    @Inject(EVENT_STATS_READER)
    private readonly statsRepo: EventStatsReader,
    private readonly config: TypedConfigService<ConfigVariables>,
  ) {}

  public getTimeZones() {
    return this.config.get('TIMEZONES');
  }

  async getStatsByDay(query: StatsQuery) {
    return this.statsRepo.groupByDay(query);
  }

  public async getStatsOverview(query: StatsQuery, nSelectedTopEvents: number) {
    const [latestEmittedAt, byType] = await Promise.all([
      this.eventReader.findLatestEmittedAt(query.from, query.to),
      this.statsRepo.groupByType(query),
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
    const rows = await this.statsRepo.groupByType(query);
    let total = 0;
    const types = rows.map((r) => {
      total += r.count;
      return { eventType: r.eventType, count: r.count };
    });
    return { total, types };
  }
}
