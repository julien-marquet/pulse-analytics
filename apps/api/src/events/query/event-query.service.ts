import { Injectable } from '@nestjs/common';
import type { EventType } from '@app/contracts';
import { PrismaService } from '../../prisma.service';
import { addLatenciesToDbEvents } from './event-query-helpers';

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
    const filters = {
      type: this.GetEventsTypeFilter(type),
      receivedAt: this.GetEventsDateFilter(from, to),
    };
    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        take: pageSize,
        skip: (page - 1) * pageSize,
        where: filters,
      }),
      this.prisma.event.count({ where: filters }),
    ]);
    return {
      data: addLatenciesToDbEvents(data),
      total,
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
