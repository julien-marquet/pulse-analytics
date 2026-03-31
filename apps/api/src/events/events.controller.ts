import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EventValidationPipe, ValidationPipe } from './events.pipe';
import {
  GetStatsByDayParamsDto,
  GetStatsByDayQueryParamsDto,
  type EventDto,
} from './events.dto';
import { EventsService } from './events.service';
import { parseUTCDate, startOfDayUTC } from 'packages/common/src/date.helpers';

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
  ) {
    return this.eventsService.GetStatsByDay(
      startOfDayUTC(parseUTCDate(params.date), queryParams.timeZone),
      queryParams.timeZone,
    );
  }
}
