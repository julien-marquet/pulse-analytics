import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { EventDto } from './events.dto';

@Injectable()
export class EventsService {
  constructor(@InjectQueue('event') private eventQueue: Queue) {}

  public async AddEvent(eventDto: EventDto) {
    await this.eventQueue.add('AddEvent', eventDto);
  }
}
