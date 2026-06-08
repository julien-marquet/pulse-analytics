import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { GetEventsQueryParamsDto } from './dtos/get-events.request.dto';
import { GetEventsResponse } from './dtos/get-events.response.dto';
import { GetStatsByDayQueryParamsDto } from './dtos/get-stats-by-day.request.dto';
import { GetStatsByDayResponse } from './dtos/get-stats-by-day.response.dto';
import { GetStatsByTypeQueryParamsDto } from './dtos/get-stats-by-type.request.dto';
import { GetStatsByTypeResponse } from './dtos/get-stats-by-type.response.dto';
import { GetStatsOverviewQueryParamsDto } from './dtos/get-stats-overview.request.dto';
import { GetStatsOverviewResponse } from './dtos/get-stats-overview.response.dto';
import { EventsIngestionService } from '../ingestion/event-ingestion.service';
import { EventsQueryService } from '../query/event-query.service';
import { EventsStatsService } from '../stats/event-stats.service';
import { ValidationPipe } from '../../validation.pipe';
import { CreateEventRequestDto } from './dtos/create-event.request.dto';
import { GetTypesResponse } from './dtos/get-types.response.dto';
import type { GetTimezonesResponse } from './dtos/get-timezones.response.dto';

@Controller('events')
export class EventsController {
  constructor(
    private eventsIngestionService: EventsIngestionService,
    private eventsQueryService: EventsQueryService,
    private eventsStatsService: EventsStatsService,
  ) {}
  @Post()
  async CreateEvent(@Body(ValidationPipe) eventDto: CreateEventRequestDto) {
    await this.eventsIngestionService.addEvent(eventDto.id, eventDto);
  }

  @Get()
  async getEvents(
    @Query(ValidationPipe) queryParams: GetEventsQueryParamsDto,
  ): Promise<GetEventsResponse> {
    const { data, total } = await this.eventsQueryService.getEvents(
      queryParams.page,
      queryParams.pageSize,
      queryParams.type,
      queryParams.from,
      queryParams.to,
      queryParams.sortBy,
      queryParams.sortAsc,
    );

    return {
      page: queryParams.page,
      pageSize: queryParams.pageSize,
      total,
      data: data as GetEventsResponse['data'],
    };
  }

  @Get('/types')
  async getTypes(): Promise<GetTypesResponse> {
    const types = await this.eventsQueryService.getTypes();

    return { types };
  }

  @Get('/stats/timezones')
  GetTimezones(): GetTimezonesResponse {
    const timezones = this.eventsStatsService.getTimeZones();

    return { timezones };
  }

  @Get('/stats/by-day')
  async getStatsByDay(
    @Query(ValidationPipe)
    queryParams: GetStatsByDayQueryParamsDto,
  ): Promise<GetStatsByDayResponse> {
    const eventsByDay = await this.eventsStatsService.getStatsByDay(
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
      eventsByDay,
    };
  }

  @Get('/stats/by-type')
  async getStatsByType(
    @Query(ValidationPipe)
    queryParams: GetStatsByTypeQueryParamsDto,
  ): Promise<GetStatsByTypeResponse> {
    return this.eventsStatsService.getStatsByType(
      queryParams.timeZone,
      queryParams.from,
      queryParams.to,
    );
  }

  @Get('/stats/overview')
  async getStatsOverview(
    @Query(ValidationPipe)
    queryParams: GetStatsOverviewQueryParamsDto,
  ): Promise<GetStatsOverviewResponse> {
    const res = await this.eventsStatsService.getStatsOverview(
      queryParams.timeZone,
      queryParams.from,
      queryParams.to,
      queryParams.nSelectedTopEvents,
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
