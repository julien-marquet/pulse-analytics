import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { environment } from '../environment';
import { PrismaService } from '../prisma.service';
import { EventPrismaWriter } from './infrastructure/event.prisma.writer';
import { EventService } from './application/event.service';
import { EventProcessor } from './presentation/event.processor';
import { EVENT_WRITER } from './application/event.writer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: environment.get('EVENT_QUEUE_NAME'),
    }),
  ],
  providers: [
    PrismaService,
    { provide: EVENT_WRITER, useClass: EventPrismaWriter },
    EventService,
    EventProcessor,
  ],
})
export class EventModule {}
