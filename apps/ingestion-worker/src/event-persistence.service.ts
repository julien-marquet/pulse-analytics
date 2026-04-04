import { getUTCMidnightForTimezone } from '@app/common';
import { EventData } from '@app/contracts';
import { Prisma } from '@app/database';
import { Injectable } from '@nestjs/common';
import { environment } from './environment';
import { PrismaService } from './prisma.service';

@Injectable()
export class EventPersistenceService {
  constructor(private readonly prisma: PrismaService) {}

  public async PersistEvent(
    id: string,
    eventData: EventData,
    receivedAt: Date,
    processedAt: Date,
  ) {
    const emittedAt = new Date(eventData.emittedAt);

    await this.prisma.$transaction([
      this.prisma.event.create({
        data: {
          id: id,
          type: eventData.type,
          properties: eventData.properties as unknown as Prisma.InputJsonValue,
          processedAt,
          emittedAt,
          receivedAt,
        },
      }),
      ...this.getDailyEventsStatsUpsertQueries(
        eventData,
        emittedAt,
        receivedAt,
        processedAt,
      ),
    ]);
  }

  private getDailyEventsStatsUpsertQueries(
    eventData: EventData,
    emittedAt: Date,
    receivedAt: Date,
    processedAt: Date,
  ) {
    const queries = [];

    const jobProcessingLatency = processedAt.valueOf() - receivedAt.valueOf();

    for (const timezone of environment.get('TIMEZONES')) {
      const dayDateInTimezone = getUTCMidnightForTimezone(emittedAt, timezone);
      queries.push(
        this.prisma.dailyEventStat.upsert({
          where: {
            date_eventType_timeZone: {
              timeZone: timezone,
              date: dayDateInTimezone,
              eventType: eventData.type,
            },
          },
          create: {
            timeZone: timezone,
            eventType: eventData.type,
            count: 1,
            date: dayDateInTimezone,
            processingLatencyTotalMs: jobProcessingLatency,
          },
          update: {
            count: { increment: 1 },
            processingLatencyTotalMs: { increment: jobProcessingLatency },
          },
        }),
      );
    }
    return queries;
  }
}
