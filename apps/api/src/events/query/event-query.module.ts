import { Module } from '@nestjs/common';
import { EventsQueryService } from 'apps/api/src/events/query/event-query.service';
import { PrismaService } from 'apps/api/src/prisma.service';

@Module({
  providers: [EventsQueryService, PrismaService],
  exports: [EventsQueryService],
})
export class EventsQueryModule {}
