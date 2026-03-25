import { Body, Controller, Post } from '@nestjs/common';
import { EventPipe } from './events.pipe';
import type { EventDto } from './events.dto';

@Controller('events')
export class EventsController {
  @Post()
  CreateEvent(@Body(EventPipe) eventDto: EventDto) {
    return `Event of type ${eventDto.type} successfully created`;
  }
}
