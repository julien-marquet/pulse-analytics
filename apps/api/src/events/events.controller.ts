import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import type { CreateEventRequestDto } from 'apps/api/src/events/dtos/create-event.request.dto';
import { EventsIngestionService } from 'apps/api/src/events/ingestion/event-ingestion.service';
import { CreateEventValidationPipe } from 'apps/api/src/events/ingestion/create-event-validation.pipe';
import { EventsQueryService } from 'apps/api/src/events/query/event-query.service';
import { EventsStatsService } from 'apps/api/src/events/stats/event-stats.service';
import { GetEventsQueryParamsDto } from 'apps/api/src/events/dtos/get-events.request.dto';
import { GetEventsResponse } from 'apps/api/src/events/dtos/get-events.response.dto';
import { GetStatsByDayQueryParamsDto } from 'apps/api/src/events/dtos/get-stats-by-day.request.dto';
import { GetStatsByDayResponse } from 'apps/api/src/events/dtos/get-stats-by-day.response.dto';
import { GetStatsByTypeQueryParamsDto } from 'apps/api/src/events/dtos/get-stats-by-type.request.dto';
import { GetStatsByTypeResponse } from 'apps/api/src/events/dtos/get-stats-by-type.response.dto';
import { GetStatsOverviewQueryParamsDto } from 'apps/api/src/events/dtos/get-stats-overview.request.dto';
import { GetStatsOverviewResponse } from 'apps/api/src/events/dtos/get-stats-overview.response.dto';

@Controller('events')
export class EventsController {
  constructor(
    private eventsIngestionService: EventsIngestionService,
    private eventsQueryService: EventsQueryService,
    private eventsStatsService: EventsStatsService,
  ) {}
  @Post()
  async CreateEvent(
    @Body(CreateEventValidationPipe) eventDto: CreateEventRequestDto,
  ) {
    await this.eventsIngestionService.AddEvent(eventDto);
  }

  @Get()
  async GetEvents(
    @Query(ValidationPipe) queryParams: GetEventsQueryParamsDto,
  ): Promise<GetEventsResponse> {
    const { data, total } = await this.eventsQueryService.GetEvents(
      queryParams.page,
      queryParams.pageSize,
      queryParams.type,
      queryParams.from,
      queryParams.to,
    );

    return {
      page: queryParams.page,
      pageSize: queryParams.pageSize,
      total,
      data: data as GetEventsResponse['data'],
    };
  }

  @Get('/stats/by-day')
  async GetStatsByDay(
    @Query(ValidationPipe)
    queryParams: GetStatsByDayQueryParamsDto,
  ): Promise<GetStatsByDayResponse> {
    return this.eventsStatsService.GetStatsByDay(
      queryParams.date,
      queryParams.timeZone,
    );
  }

  @Get('/stats/by-type')
  async GetStatsByType(
    @Query(ValidationPipe)
    queryParams: GetStatsByTypeQueryParamsDto,
  ): Promise<GetStatsByTypeResponse> {
    return this.eventsStatsService.GetStatsByType(
      queryParams.eventType,
      queryParams.timeZone,
      queryParams.from,
      queryParams.to,
    );
  }

  @Get('/stats/overview')
  async GetStatsOverview(
    @Query(ValidationPipe)
    queryParams: GetStatsOverviewQueryParamsDto,
  ): Promise<GetStatsOverviewResponse> {
    const res = await this.eventsStatsService.GetStatsOverview(
      queryParams.timeZone,
      queryParams.from,
      queryParams.to,
    );
    return {
      period: {
        from: queryParams.from,
        to: queryParams.to,
        timeZone: queryParams.timeZone,
      },
      ...res,
    };
  }
}
