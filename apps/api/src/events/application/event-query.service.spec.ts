import { EventsQueryService } from './event-query.service';
import { EventFinder } from './event.finder';

describe('EventQueryService', () => {
  let service: EventsQueryService;
  let reader: jest.Mocked<EventFinder>;

  beforeEach(() => {
    reader = {
      getTypes: jest.fn(),
      findMany: jest.fn(),
      findLatestEmittedAt: jest.fn(),
    };
    service = new EventsQueryService(reader);
  });

  describe('getTypes', () => {
    it('should delegate to the repository', async () => {
      reader.getTypes.mockResolvedValue(['page-viewed', 'button-clicked']);

      const result = await service.getTypes();

      expect(reader.getTypes).toHaveBeenCalledTimes(1);
      expect(result).toEqual(['page-viewed', 'button-clicked']);
    });
  });

  describe('getEvents', () => {
    it('should delegate to the repository with the same query', async () => {
      const query = { page: 1, pageSize: 10, type: ['PAGE_VIEWED'] };
      reader.findMany.mockResolvedValue({ data: [], total: 0 });

      const result = await service.getEvents(query);

      expect(reader.findMany).toHaveBeenCalledWith(query);
      expect(result).toEqual({ data: [], total: 0 });
    });
  });
});
