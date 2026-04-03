import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AddEventValidationPipe } from './events.pipe';
import { EventsService } from './events.service';
import { ValidationPipe } from 'apps/api/src/validation.pipe';
import {
  GetEventsQueryParamsDto,
  GetStatsByDayQueryParamsDto,
  GetStatsByTypeQueryParamsDto,
  GetStatsOverviewQueryParamsDto,
} from 'apps/api/src/events/dtos/events.request.dto';
import type { AddEventRequestDto } from 'apps/api/src/events/dtos/addEvent.request.dto';
import {
  GetEventsResponse,
  GetStatsByDayResponse,
  GetStatsByTypeResponse,
  GetStatsOverviewResponse,
} from 'apps/api/src/events/dtos/events.response.dto';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}
  @Post()
  async CreateEvent(
    @Body(AddEventValidationPipe) eventDto: AddEventRequestDto,
  ) {
    await this.eventsService.AddEvent(eventDto);
  }

  @Get()
  async GetEvents(
    @Query(ValidationPipe) queryParams: GetEventsQueryParamsDto,
  ): Promise<GetEventsResponse> {
    const { data, total } = await this.eventsService.GetEvents(
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
    return this.eventsService.GetStatsByDay(
      queryParams.date,
      queryParams.timeZone,
    );
  }

  @Get('/stats/by-type')
  async GetStatsByType(
    @Query(ValidationPipe)
    queryParams: GetStatsByTypeQueryParamsDto,
  ): Promise<GetStatsByTypeResponse> {
    return this.eventsService.GetStatsByType(
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
    const res = await this.eventsService.GetStatsOverview(
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
