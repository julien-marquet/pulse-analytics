import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { TypedConfigService } from '@app/common';
import request from 'supertest';
import { useContainer } from 'class-validator';
import { EventsController } from './events.controller';
import { EventsIngestionService } from '../application/event-ingestion.service';
import { EventsQueryService } from '../application/event-query.service';
import { EventsStatsService } from '../application/event-stats.service';

import {
  DAILY_EVENT_STATS_READ_MODEL,
  type DailyEventStatsReadModel,
} from '../application/daily-event-stats.read-model';

import { IsAllowedTimezoneConstraint } from '../../utils/is-allowed-timezone.validator';
import { createBullmqQueueMock } from '../../bullmq.queue.mock';
import { createConfigServiceMock } from '../../config.service.mock';
import { environment } from '../../environment';
import { Event, Timing } from '@app/events-domain';
import { EVENT_FINDER, EventFinder } from '../application/event.finder';

describe('EventsController (integration)', () => {
  let app: INestApplication;
  let eventFinder: jest.Mocked<EventFinder>;
  let statsRepo: jest.Mocked<DailyEventStatsReadModel>;

  const mockEvent = Event.create({
    id: 'evt-1',
    type: 'click',
    timing: Timing.create(new Date(), new Date(), new Date()),
    properties: {},
  });

  beforeAll(async () => {
    eventFinder = {
      getTypes: jest.fn(),
      findMany: jest.fn(),
      findLatestEmittedAt: jest.fn(),
    };
    statsRepo = {
      groupByDay: jest.fn(),
      groupByType: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        EventsQueryService,
        EventsIngestionService,
        EventsStatsService,
        IsAllowedTimezoneConstraint,
        { provide: EVENT_FINDER, useValue: eventFinder },
        { provide: DAILY_EVENT_STATS_READ_MODEL, useValue: statsRepo },
        {
          provide: getQueueToken(environment.get('EVENT_QUEUE_NAME')),
          useValue: createBullmqQueueMock(),
        },
        {
          provide: TypedConfigService,
          useValue: createConfigServiceMock({
            TIMEZONES: ['UTC', 'Europe/Paris'],
          }),
        },
      ],
    }).compile();

    useContainer(moduleRef, { fallbackOnErrors: true });
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(() => app.close());

  beforeEach(() => jest.clearAllMocks());

  describe('GET /events', () => {
    it('returns paginated events', async () => {
      eventFinder.findMany.mockResolvedValue({ data: [mockEvent], total: 1 });

      return request(app.getHttpServer())
        .get('/events?page=1&pageSize=10')
        .expect(200)
        .expect(({ body }) => {
          expect(body.page).toBe(1);
          expect(body.pageSize).toBe(10);
          expect(body.total).toBe(1);
          expect(body.data).toHaveLength(1);
        });
    });

    it('returns 400 when page is missing', () => {
      return request(app.getHttpServer())
        .get('/events?pageSize=10')
        .expect(400);
    });
  });

  describe('GET /events/types', () => {
    it('returns event types', async () => {
      eventFinder.getTypes.mockResolvedValue(['click', 'view']);

      return request(app.getHttpServer())
        .get('/events/types')
        .expect(200)
        .expect({ types: ['click', 'view'] });
    });
  });

  describe('POST /events', () => {
    it('returns 201 for a valid event', () => {
      return request(app.getHttpServer())
        .post('/events')
        .send({ type: 'click', emittedAt: '2024-01-01T00:00:00.000Z' })
        .expect(201);
    });

    it('returns 400 when type is missing', () => {
      return request(app.getHttpServer())
        .post('/events')
        .send({ emittedAt: '2024-01-01T00:00:00.000Z' })
        .expect(400);
    });

    it('returns 400 when emittedAt is missing', () => {
      return request(app.getHttpServer())
        .post('/events')
        .send({ type: 'click' })
        .expect(400);
    });
  });

  describe('GET /events/stats/timezones', () => {
    it('returns configured timezones', () => {
      return request(app.getHttpServer())
        .get('/events/stats/timezones')
        .expect(200)
        .expect({ timezones: ['UTC', 'Europe/Paris'] });
    });
  });

  describe('GET /events/stats/by-day', () => {
    it('returns daily stats', async () => {
      statsRepo.groupByDay.mockResolvedValue([
        { date: '2024-01-01', count: 5, averageLatencyMs: 100 },
      ]);

      return request(app.getHttpServer())
        .get('/events/stats/by-day?from=2024-01-01&to=2024-01-31&timeZone=UTC')
        .expect(200)
        .expect(({ body }) => {
          expect(body.period).toEqual({
            from: '2024-01-01',
            to: '2024-01-31',
            timeZone: 'UTC',
          });
          expect(body.eventsByDay).toHaveLength(1);
        });
    });

    it('returns 400 when from is missing', () => {
      return request(app.getHttpServer())
        .get('/events/stats/by-day?to=2024-01-31')
        .expect(400);
    });

    it('returns 400 for an unknown timezone', () => {
      return request(app.getHttpServer())
        .get(
          '/events/stats/by-day?from=2024-01-01&to=2024-01-31&timeZone=Mars/Olympus',
        )
        .expect(400);
    });
  });

  describe('GET /events/stats/by-type', () => {
    it('returns type stats', async () => {
      statsRepo.groupByType.mockResolvedValue([
        { eventType: 'click', count: 10, processingLatencyTotalMs: 1000 },
      ]);

      return request(app.getHttpServer())
        .get('/events/stats/by-type?from=2024-01-01&to=2024-01-31')
        .expect(200)
        .expect(({ body }) => {
          expect(body.total).toBe(10);
          expect(body.types).toHaveLength(1);
        });
    });
  });

  describe('GET /events/stats/overview', () => {
    it('returns stats overview', async () => {
      statsRepo.groupByType.mockResolvedValue([
        { eventType: 'click', count: 10, processingLatencyTotalMs: 1000 },
      ]);
      eventFinder.findLatestEmittedAt.mockResolvedValue(
        new Date('2024-01-15T12:00:00Z'),
      );

      return request(app.getHttpServer())
        .get('/events/stats/overview?from=2024-01-01&to=2024-01-31')
        .expect(200)
        .expect(({ body }) => {
          expect(body.totalEvents).toBe(10);
          expect(body.eventTypesCount).toBe(1);
          expect(body.topEventTypes).toHaveLength(1);
          expect(body.latestEventAt).toBe('2024-01-15T12:00:00.000Z');
        });
    });

    it('returns 400 when from is missing', () => {
      return request(app.getHttpServer())
        .get('/events/stats/overview?to=2024-01-31')
        .expect(400);
    });
  });
});
