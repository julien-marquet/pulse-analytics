import { Inject, Injectable } from '@nestjs/common';
import { TypedConfigService } from '@app/common';
import { ConfigVariables } from '../../config';
import {
  EVENT_REPOSITORY,
  type EventRepository,
} from '../domain/event.repository';
import {
  EVENT_STATS_REPOSITORY,
  StatsQuery,
  type EventStatsRepository,
} from '../domain/event-stats.repository';

@Injectable()
export class EventsStatsService {
  constructor(
    @Inject(EVENT_REPOSITORY) private readonly eventRepo: EventRepository,
    @Inject(EVENT_STATS_REPOSITORY)
    private readonly statsRepo: EventStatsRepository,
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
      this.eventRepo.findLatestEmittedAt(query.from, query.to),
      this.statsRepo.groupByType(query),
    ]);

    let totalEvents = 0;
    let totalLatencyMs = 0;
    for (const row of byType) {
      totalEvents += row.count ?? 0;
      totalLatencyMs += row.processingLatencyTotalMs ?? 0;
    }

    return {
      totalEvents,
      averageProcessingLatencyMs:
        totalEvents === 0 ? null : totalLatencyMs / totalEvents,
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
