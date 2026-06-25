import { Inject, Injectable } from '@nestjs/common';
import { TypedConfigService } from '@app/common';
import { ConfigVariables } from '../../config';
import { OnEvent } from '@nestjs/event-emitter';
import {
  DAILY_EVENT_STATS_REPOSITORY,
  type DailyEventStatsRepository,
} from './daily-event-stats.repository';
import { Event } from '@app/events-domain';

@Injectable()
export class DailyEventStatsService {
  constructor(
    private readonly config: TypedConfigService<ConfigVariables>,
    @Inject(DAILY_EVENT_STATS_REPOSITORY)
    private readonly writer: DailyEventStatsRepository,
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
