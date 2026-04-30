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
    sortBy?: 'emittedAt' | 'type',
    sortAsc?: boolean,
  ) {
    const filters = {
      type: this._getEventsTypeFilter(type),
      emittedAt: this._getEventsDateFilter(from, to),
    };

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        take: pageSize,
        skip: (page - 1) * pageSize,
        where: filters,
        orderBy: this._getEventsOrderBy(sortBy, sortAsc),
      }),
      this.prisma.event.count({ where: filters }),
    ]);
    return {
      data: addLatenciesToDbEvents(data),
      total,
    };
  }

  private _getEventsOrderBy(
    sortBy: 'emittedAt' | 'type' = 'emittedAt',
    sortAsc: boolean = false,
  ) {
    const sortOrder: 'asc' | 'desc' = sortAsc ? 'asc' : 'desc';
    return sortBy == 'emittedAt'
      ? {
          emittedAt: sortOrder,
        }
      : {
          type: sortOrder,
        };
  }

  private _getEventsTypeFilter(type?: string[]) {
    if (!type || type.length === 0) return undefined;
    return { in: type };
  }
  private _getEventsDateFilter(from?: Date, to?: Date) {
    return {
      lte: to,
      gte: from,
    };
  }
}
