import { Inject, Injectable } from '@nestjs/common';
import { TypedConfigService } from '@app/common';
import { ConfigVariables } from '../../config';
import { OnEvent } from '@nestjs/event-emitter';
import {
  EVENT_STATS_WRITER,
  type EventStatsWriter,
} from './event-stats.writer';
import { Event } from '@app/events-domain';

@Injectable()
export class EventStatsService {
  constructor(
    private readonly config: TypedConfigService<ConfigVariables>,
    @Inject(EVENT_STATS_WRITER) private readonly writer: EventStatsWriter,
  ) {}

  @OnEvent('event.created')
  public async saveEventStats(event: Event) {
    await Promise.allSettled(
      this.config
        .get('TIMEZONES')
        .map((timeZone) => this.writer.save(event, timeZone)),
    );
  }
}
