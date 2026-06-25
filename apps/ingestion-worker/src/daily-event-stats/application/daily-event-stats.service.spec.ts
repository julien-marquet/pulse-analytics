import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { TypedConfigService } from '@app/common';
import { ConfigVariables } from '../../config';
import { DailyEventStatsService } from './daily-event-stats.service';
import { type DailyEventStatsRepository } from './daily-event-stats.repository';
import { Event, Timing } from '@app/events-domain';

type ConfigMock = DeepMockProxy<TypedConfigService<ConfigVariables>>;
type EventStatsWriterMock = DeepMockProxy<DailyEventStatsRepository>;

const makeEvent = () =>
  Event.create({
    id: 'evt-1',
    type: 'page-viewed',
    timing: Timing.create(
      new Date('2026-04-09T12:00:00.000Z'),
      new Date('2026-04-09T12:00:00.100Z'),
      new Date('2026-04-09T12:00:00.150Z'),
    ),
    properties: {},
  });

describe('DailyEventStatsService', () => {
  let service: DailyEventStatsService;
  let config: ConfigMock;
  let writer: EventStatsWriterMock;

  beforeEach(() => {
    config = mockDeep<TypedConfigService<ConfigVariables>>();
    writer = mockDeep<DailyEventStatsRepository>();
    service = new DailyEventStatsService(config, writer);
  });

  describe('saveEventStats', () => {
    it('should call writer.save once per timezone', async () => {
      config.get.mockReturnValue(['UTC', 'America/New_York']);

      await service.saveEventStats(makeEvent());

      expect(writer.save).toHaveBeenCalledTimes(2);
    });

    it('should call writer.save with the event and each timezone', async () => {
      config.get.mockReturnValue(['UTC', 'America/New_York']);
      const event = makeEvent();

      await service.saveEventStats(event);

      expect(writer.save).toHaveBeenCalledWith(event, 'UTC');
      expect(writer.save).toHaveBeenCalledWith(event, 'America/New_York');
    });

    it('should not throw when a save fails', async () => {
      config.get.mockReturnValue(['UTC']);
      writer.save.mockRejectedValue(new Error('DB failure'));

      await expect(service.saveEventStats(makeEvent())).resolves.not.toThrow();
    });

    it('should not call writer.save when TIMEZONES is empty', async () => {
      config.get.mockReturnValue([]);

      await service.saveEventStats(makeEvent());

      expect(writer.save).not.toHaveBeenCalled();
    });
  });
});
