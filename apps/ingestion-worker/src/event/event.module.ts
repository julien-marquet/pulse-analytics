import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { environment } from '../environment';
import { PrismaService } from '../prisma.service';
import { EventPrismaWriter } from './infrastructure/event.prisma.writer';
import { EventService } from './application/event.service';
import { EventProcessor } from './presentation/event.processor';
import { EVENT_REPOSITORY } from '@app/events-domain';

@Module({
  imports: [
    BullModule.registerQueue({
      name: environment.get('EVENT_QUEUE_NAME'),
    }),
  ],
  providers: [
    PrismaService,
    { provide: EVENT_REPOSITORY, useClass: EventPrismaWriter },
    EventService,
    EventProcessor,
  ],
})
export class EventModule {}
