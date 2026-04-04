import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { EventsQueryService } from './event-query.service';
@Module({
  providers: [EventsQueryService, PrismaService],
  exports: [EventsQueryService],
})
export class EventsQueryModule {}
