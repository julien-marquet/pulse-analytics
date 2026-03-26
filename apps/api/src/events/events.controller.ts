import { Body, Controller, Post } from '@nestjs/common';
import { EventPipe } from './events.pipe';
import type { EventDto } from './events.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}
  @Post()
  async CreateEvent(@Body(EventPipe) eventDto: EventDto) {
    await this.eventsService.AddEvent(eventDto);
  }
}
