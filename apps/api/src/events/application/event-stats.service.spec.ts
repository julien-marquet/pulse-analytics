import { TypedConfigService } from '@app/common';
import { EventsStatsService } from './event-stats.service';
import { EventRepository } from '../domain/event.repository';
import { EventStatsRepository } from '../domain/event-stats.repository';
import { ConfigVariables } from '../../config';

describe('EventStatsService', () => {
  let service: EventsStatsService;
  let eventRepo: jest.Mocked<EventRepository>;
  let statsRepo: jest.Mocked<EventStatsRepository>;

  const query = { timeZone: 'UTC', from: '2026-03-01', to: '2026-04-01' };

  beforeEach(() => {
    eventRepo = {
      getTypes: jest.fn(),
      findMany: jest.fn(),
      findLatestEmittedAt: jest.fn(),
    };
    statsRepo = {
      groupByDay: jest.fn(),
      groupByType: jest.fn(),
    };
    const config = new TypedConfigService<ConfigVariables>({
      TIMEZONES: ['UTC'],
    });
    service = new EventsStatsService(eventRepo, statsRepo, config);
  });

  describe('getTimeZones', () => {
    it('should return the configured timezones', () => {
      expect(service.getTimeZones()).toEqual(['UTC']);
    });
  });

  describe('getStatsByDay', () => {
    it('should delegate to the stats repository', async () => {
      const rows = [{ date: '2026-03-01', count: 5, averageLatencyMs: 2 }];
      statsRepo.groupByDay.mockResolvedValue(rows);

      const result = await service.getStatsByDay(query);

      expect(statsRepo.groupByDay).toHaveBeenCalledWith(query);
      expect(result).toEqual(rows);
    });
  });

  describe('getStatsByType', () => {
    it('should compute total and map types from repository rows', async () => {
      statsRepo.groupByType.mockResolvedValue([
        { eventType: 'page-viewed', count: 20, processingLatencyTotalMs: 2000 },
        {
          eventType: 'button-clicked',
          count: 15,
          processingLatencyTotalMs: 1500,
        },
      ]);

      const result = await service.getStatsByType(query);

      expect(result).toEqual({
        total: 35,
        types: [
          { eventType: 'page-viewed', count: 20 },
          { eventType: 'button-clicked', count: 15 },
        ],
      });
    });

    it('should return zero total and empty types when there are no results', async () => {
      statsRepo.groupByType.mockResolvedValue([]);

      expect(await service.getStatsByType(query)).toEqual({
        total: 0,
        types: [],
      });
    });
  });

  describe('getStatsOverview', () => {
    it('should compute all aggregate fields correctly', async () => {
      eventRepo.findLatestEmittedAt.mockResolvedValue(
        new Date('2026-04-01T12:00:00.000Z'),
      );
      statsRepo.groupByType.mockResolvedValue([
        { eventType: 'page-viewed', count: 20, processingLatencyTotalMs: 2000 },
        {
          eventType: 'button-clicked',
          count: 15,
          processingLatencyTotalMs: 1500,
        },
      ]);

      const result = await service.getStatsOverview(query, 3);

      expect(result.totalEvents).toBe(35);
      expect(result.averageProcessingLatencyMs).toBe(100); // 3500 / 35
      expect(result.eventTypesCount).toBe(2);
      expect(result.topEventTypes).toEqual([
        { eventType: 'page-viewed', count: 20 },
        { eventType: 'button-clicked', count: 15 },
      ]);
      expect(result.latestEventAt).toBe('2026-04-01T12:00:00.000Z');
    });

    it('should set averageProcessingLatencyMs to null when there are no events', async () => {
      eventRepo.findLatestEmittedAt.mockResolvedValue(null);
      statsRepo.groupByType.mockResolvedValue([]);

      const result = await service.getStatsOverview(query, 3);

      expect(result.averageProcessingLatencyMs).toBeNull();
      expect(result.totalEvents).toBe(0);
    });

    it('should set latestEventAt to undefined when no event exists', async () => {
      eventRepo.findLatestEmittedAt.mockResolvedValue(null);
      statsRepo.groupByType.mockResolvedValue([]);

      const result = await service.getStatsOverview(query, 3);

      expect(result.latestEventAt).toBeUndefined();
    });

    it('should slice topEventTypes to nSelectedTopEvents', async () => {
      eventRepo.findLatestEmittedAt.mockResolvedValue(null);
      statsRepo.groupByType.mockResolvedValue([
        { eventType: 'a', count: 30, processingLatencyTotalMs: 0 },
        { eventType: 'b', count: 20, processingLatencyTotalMs: 0 },
        { eventType: 'c', count: 10, processingLatencyTotalMs: 0 },
      ]);

      const result = await service.getStatsOverview(query, 2);

      expect(result.topEventTypes).toHaveLength(2);
      expect(result.topEventTypes[0].eventType).toBe('a');
    });

    it('should call both repositories with the correct arguments', async () => {
      eventRepo.findLatestEmittedAt.mockResolvedValue(null);
      statsRepo.groupByType.mockResolvedValue([]);

      await service.getStatsOverview(query, 3);

      expect(eventRepo.findLatestEmittedAt).toHaveBeenCalledWith(
        query.from,
        query.to,
      );
      expect(statsRepo.groupByType).toHaveBeenCalledWith(query);
    });
  });
});
