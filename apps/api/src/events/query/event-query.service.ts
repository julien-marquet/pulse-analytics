import { Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/api/src/prisma.service';
import { type Event as DbEvent } from '@app/database';
import type { EventType } from '@app/contracts';

@Injectable()
export class EventsQueryService {
  constructor(private readonly prisma: PrismaService) {}

  public async GetEvents(
    page: number,
    pageSize: number,
    type?: EventType[],
    from?: Date,
    to?: Date,
  ) {
    const filters = this.GetEventsFilter(type, from, to);
    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        take: pageSize,
        skip: (page - 1) * pageSize,
        where: filters,
      }),
      this.prisma.event.count({ where: filters }),
    ]);
    return {
      data: this.addLatenciesToDbEvents(data),
      total,
    };
  }

  private addLatenciesToDbEvents(data: DbEvent[]) {
    return data.map((dbEvent) => {
      const ingestionLatencyMs =
        new Date(dbEvent.receivedAt).valueOf() -
        new Date(dbEvent.emittedAt).valueOf();
      const processingLatencyMs =
        new Date(dbEvent.processedAt).valueOf() -
        new Date(dbEvent.receivedAt).valueOf();
      return {
        ...dbEvent,
        latencies: {
          ingestionLatencyMs,
          processingLatencyMs,
          totalLatencyMs: ingestionLatencyMs + processingLatencyMs,
        },
      };
    });
  }

  private GetEventsFilter(type?: EventType[], from?: Date, to?: Date) {
    return {
      type: this.GetEventsTypeFilter(type),
      receivedAt: this.GetEventsDateFilter(from, to),
    };
  }

  private GetEventsTypeFilter(type?: EventType[]) {
    if (!type || type.length === 0) return undefined;
    return { in: type };
  }
  private GetEventsDateFilter(from?: Date, to?: Date) {
    return {
      lte: to,
      gte: from,
    };
  }
}
