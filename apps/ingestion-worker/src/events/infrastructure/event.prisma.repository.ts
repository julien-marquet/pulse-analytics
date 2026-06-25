import { Event, EventRepository } from '@app/events-domain';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@app/database';

@Injectable()
export class EventPrismaRepository implements EventRepository {
  constructor(private readonly prisma: PrismaService) {}
  async save(event: Event): Promise<void> {
    await this.prisma.event.create({
      data: {
        id: event.id,
        type: event.type,
        properties: event.properties as Prisma.InputJsonValue,
        processedAt: event.timing.processedAt,
        emittedAt: event.timing.emittedAt,
        receivedAt: event.timing.receivedAt,
      },
    });
  }
}
