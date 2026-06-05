import { EventData } from '@app/contracts';
import { Prisma } from '@app/database';
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TypedConfigService } from '@app/common';
import { getDailyEventsStatsUpsertQueries } from './event-persistence.service.helpers';
import { ConfigVariables } from './config';

@Injectable()
export class EventPersistenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: TypedConfigService<ConfigVariables>,
  ) {}

  public async PersistEvent(
    id: string,
    eventData: EventData,
    receivedAt: Date,
    processedAt: Date,
  ) {
    const emittedAt = new Date(eventData.emittedAt);

    await this.prisma.$transaction([
      this.getCreateEventPromise(
        id,
        eventData,
        receivedAt,
        processedAt,
        emittedAt,
      ),
      ...this.getUpsertDailyEventsPromises(
        eventData,
        receivedAt,
        processedAt,
        emittedAt,
      ),
    ]);
  }

  private getCreateEventPromise(
    id: string,
    eventData: EventData,
    receivedAt: Date,
    processedAt: Date,
    emittedAt: Date,
  ) {
    return this.prisma.event.create({
      data: {
        id: id,
        type: eventData.type,
        properties: eventData.properties as unknown as Prisma.InputJsonValue,
        processedAt,
        emittedAt,
        receivedAt,
      },
    });
  }

  private getUpsertDailyEventsPromises(
    eventData: EventData,
    receivedAt: Date,
    processedAt: Date,
    emittedAt: Date,
  ) {
    return getDailyEventsStatsUpsertQueries(
      eventData,
      emittedAt,
      receivedAt,
      processedAt,
      this.config.get('TIMEZONES'),
    ).map((query) => this.prisma.dailyEventStat.upsert(query));
  }
}
