import {
  DEFAULT_PAGE_SIZE,
  FindEventsQuery,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from './find-events.query';

describe('FindEventsQuery', () => {
  it('should use the provided page size', () => {
    const query = FindEventsQuery.create({ page: 1, pageSize: 10 });
    expect(query.pageSize).toBe(10);
  });

  it('should use the default page size when not provided', () => {
    const query = FindEventsQuery.create({ page: 1 });
    expect(query.pageSize).toBe(DEFAULT_PAGE_SIZE);
  });

  describe('pageSize bounds', () => {
    it('should throw when pageSize is less than MIN_PAGE_SIZE', () => {
      expect(() => {
        FindEventsQuery.create({ page: 1, pageSize: MIN_PAGE_SIZE - 1 });
      }).toThrow();
    });

    it('should throw when pageSize is greater than MAX_PAGE_SIZE', () => {
      expect(() => {
        FindEventsQuery.create({ page: 1, pageSize: MAX_PAGE_SIZE + 1 });
      }).toThrow();
    });

    it('should pass when pageSize is exactly MAX_PAGE_SIZE', () => {
      const query = FindEventsQuery.create({
        page: 1,
        pageSize: MAX_PAGE_SIZE,
      });
      expect(query.pageSize).toBe(MAX_PAGE_SIZE);
    });
  });
});
