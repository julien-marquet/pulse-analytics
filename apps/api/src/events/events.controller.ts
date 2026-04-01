import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EventValidationPipe } from './events.pipe';
import { EventsService } from './events.service';
import { parseUTCDate, startOfDayUTC } from 'packages/common/src/date.helpers';
import { ValidationPipe } from 'apps/api/src/validation.pipe';
import {
  GetEventsQueryParamsDto,
  GetStatsByDayParamsDto,
  GetStatsByDayQueryParamsDto,
  GetStatsByTypeParamsDto,
  GetStatsByTypeQueryParamsDto,
} from 'apps/api/src/events/events.request.dto';
import type { EventDto } from 'apps/api/src/events/events.dto';
import {
  GetEventsResponse,
  GetStatsByDayResponse,
  GetStatsByTypeResponse,
} from 'apps/api/src/events/events.response.dto';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}
  @Post()
  async CreateEvent(@Body(EventValidationPipe) eventDto: EventDto) {
    await this.eventsService.AddEvent(eventDto);
  }

  @Get()
  async GetEvents(
    @Query(ValidationPipe) queryParams: GetEventsQueryParamsDto,
  ): Promise<GetEventsResponse> {
    const { data, total } = await this.eventsService.GetEvents(
      queryParams.page,
      queryParams.pageSize,
    );

    return {
      page: queryParams.page,
      pageSize: queryParams.pageSize,
      total,
      data: data as GetEventsResponse['data'],
    };
  }

  @Get('/stats/by-day/:date')
  async GetStatsByDay(
    @Param(ValidationPipe)
    params: GetStatsByDayParamsDto,
    @Query(ValidationPipe)
    queryParams: GetStatsByDayQueryParamsDto,
  ): Promise<GetStatsByDayResponse> {
    return this.eventsService.GetStatsByDay(
      startOfDayUTC(parseUTCDate(params.date), queryParams.timeZone),
      queryParams.timeZone,
    );
  }

  @Get('/stats/by-type/:eventType')
  async GetStatsByType(
    @Param(ValidationPipe)
    params: GetStatsByTypeParamsDto,
    @Query(ValidationPipe)
    queryParams: GetStatsByTypeQueryParamsDto,
  ): Promise<GetStatsByTypeResponse> {
    return this.eventsService.GetStatsByType(
      params.eventType,
      parseUTCDate(queryParams.from),
      parseUTCDate(queryParams.to),
    );
  }
}
