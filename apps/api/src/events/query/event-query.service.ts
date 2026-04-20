import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { addLatenciesToDbEvents } from './event-query-helpers';

@Injectable()
export class EventsQueryService {
  constructor(private readonly prisma: PrismaService) {}

  public async GetTypes() {
    const response = await this.prisma.event.findMany({
      select: { type: true },
      distinct: 'type',
    });

    return response.map((i) => i.type);
  }
  public async GetEvents(
    page: number,
    pageSize: number,
    type?: string[],
    from?: Date,
    to?: Date,
  ) {
    console.log(from);
    const filters = {
      type: this.GetEventsTypeFilter(type),
      emittedAt: this.GetEventsDateFilter(from, to),
    };
    console.log(filters);
    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        take: pageSize,
        skip: (page - 1) * pageSize,
        where: filters,
      }),
      this.prisma.event.count({ where: filters }),
    ]);
    console.log(data);
    return {
      data: addLatenciesToDbEvents(data),
      total,
    };
  }

  private GetEventsTypeFilter(type?: string[]) {
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
