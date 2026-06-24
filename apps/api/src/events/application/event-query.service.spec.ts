import { EventsQueryService } from './event-query.service';
import { EventRepository } from '@app/events-domain';

describe('EventQueryService', () => {
  let service: EventsQueryService;
  let repo: jest.Mocked<EventRepository>;

  beforeEach(() => {
    repo = {
      getTypes: jest.fn(),
      findMany: jest.fn(),
      findLatestEmittedAt: jest.fn(),
    };
    service = new EventsQueryService(repo);
  });

  describe('getTypes', () => {
    it('should delegate to the repository', async () => {
      repo.getTypes.mockResolvedValue(['page-viewed', 'button-clicked']);

      const result = await service.getTypes();

      expect(repo.getTypes).toHaveBeenCalledTimes(1);
      expect(result).toEqual(['page-viewed', 'button-clicked']);
    });
  });

  describe('getEvents', () => {
    it('should delegate to the repository with the same query', async () => {
      const query = { page: 1, pageSize: 10, type: ['PAGE_VIEWED'] };
      repo.findMany.mockResolvedValue({ data: [], total: 0 });

      const result = await service.getEvents(query);

      expect(repo.findMany).toHaveBeenCalledWith(query);
      expect(result).toEqual({ data: [], total: 0 });
    });
  });
});
