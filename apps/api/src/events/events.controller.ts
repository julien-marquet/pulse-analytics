import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EventValidationPipe } from './events.pipe';
import { EventsService } from './events.service';
import { parseUTCDate, startOfDayUTC } from 'packages/common/src/date.helpers';
import { ValidationPipe } from 'apps/api/src/validation.pipe';
import {
  GetStatsByDayParamsDto,
  GetStatsByDayQueryParamsDto,
  GetStatsByTypeParamsDto,
  GetStatsByTypeQueryParamsDto,
} from 'apps/api/src/events/events.request.dto';
import type { EventDto } from 'apps/api/src/events/events.dto';
import {
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
