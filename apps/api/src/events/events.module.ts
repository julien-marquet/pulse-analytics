import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { BullModule } from '@nestjs/bullmq';
import { environment } from '../environment';
import { PrismaService } from 'apps/api/src/prisma.service';

@Module({
  controllers: [EventsController],
  imports: [
    BullModule.forRoot({
      connection: { url: environment.get('REDIS_URL') },
    }),
    BullModule.registerQueue({ name: environment.get('EVENT_QUEUE_NAME') }),
  ],
  providers: [EventsService, PrismaService],
})
export class EventsModule {}
