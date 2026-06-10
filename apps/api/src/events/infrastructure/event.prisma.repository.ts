import { DatePrismaConverter } from '@app/common';
import { type Event as DbEvent } from '@app/database';
import { PrismaService } from '../../prisma.service';
import { Event } from '../domain/event.aggregate';
import { EventQuery, EventRepository } from '../domain/event.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventPrismaRepository implements EventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getTypes(): Promise<string[]> {
    const response = await this.prisma.event.findMany({
      select: { type: true },
      distinct: 'type',
    });

    return response.map((i) => i.type);
  }

  async findMany(query: EventQuery): Promise<{ data: Event[]; total: number }> {
    const filters = {
      type: query.type?.length ? { in: query.type } : undefined,
      emittedAt: { gte: query.from, lte: query.to },
    };
    const [rows, total] = await Promise.all([
      this.prisma.event.findMany({
        take: query.pageSize,
        skip: (query.page - 1) * query.pageSize,
        where: filters,
        orderBy: this._getEventsOrderBy(query.sortBy, query.sortAsc),
      }),
      this.prisma.event.count({ where: filters }),
    ]);
    return { data: rows.map((row) => this.toDomain(row)), total };
  }

  async findLatestEmittedAt(from?: string, to?: string): Promise<Date | null> {
    const row = await this.prisma.event.findFirst({
      orderBy: { emittedAt: 'desc' },
      where: {
        emittedAt: {
          lte: to ? DatePrismaConverter.toPrisma(to) : undefined,
          gte: from ? DatePrismaConverter.toPrisma(from) : undefined,
        },
      },
    });
    return row?.emittedAt ?? null;
  }

  private toDomain(row: DbEvent): Event {
    return Event.create({
      id: row.id,
      type: row.type,
      emittedAt: row.emittedAt,
      receivedAt: row.receivedAt,
      processedAt: row.processedAt,
      properties: (row.properties ?? {}) as Record<string, unknown>,
    });
  }

  private _getEventsOrderBy(
    sortBy: 'emittedAt' | 'type' = 'emittedAt',
    sortAsc: boolean = false,
  ) {
    const sortOrder: 'asc' | 'desc' = sortAsc ? 'asc' : 'desc';
    if (sortBy == 'emittedAt')
      return {
        emittedAt: sortOrder,
      };
    return {
      type: sortOrder,
    };
  }
}
