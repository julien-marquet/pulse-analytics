import { Event, EventWriter } from '@app/events-domain';
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@app/database';

@Injectable()
export class EventPrismaWriter implements EventWriter {
  constructor(private readonly prisma: PrismaService) {}
  async save(event: Event): Promise<void> {
    await this.prisma.event.create({
      data: {
        id: event.id,
        type: event.type,
        properties: event.properties as Prisma.InputJsonValue,
        processedAt: event.processedAt,
        emittedAt: event.emittedAt,
        receivedAt: event.receivedAt,
      },
    });
  }
}
