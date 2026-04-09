import { countDistinctValueOfField } from './collection.utils';

describe('CollectionUtils', () => {
  describe('countDistinctValueOfField', () => {
    it('should return 0 for an empty collection', () => {
      expect(countDistinctValueOfField([], 'type')).toBe(0);
    });

    it('should return 1 when all entries have the same value', () => {
      const collection = [{ type: 'a' }, { type: 'a' }, { type: 'a' }];
      expect(countDistinctValueOfField(collection, 'type')).toBe(1);
    });

    it('should return the number of distinct values', () => {
      const collection = [
        { type: 'a' },
        { type: 'b' },
        { type: 'a' },
        { type: 'c' },
      ];
      expect(countDistinctValueOfField(collection, 'type')).toBe(3);
    });

    it('should return 1 for a single-entry collection', () => {
      expect(countDistinctValueOfField([{ type: 'a' }], 'type')).toBe(1);
    });

    it('should count distinct values on the specified key only', () => {
      const collection = [
        { type: 'a', category: 'x' },
        { type: 'b', category: 'x' },
        { type: 'a', category: 'y' },
      ];
      expect(countDistinctValueOfField(collection, 'category')).toBe(2);
    });

    it('should treat undefined as a distinct value', () => {
      const collection = [
        { type: undefined },
        { type: undefined },
        { type: 'a' },
      ];
      expect(
        countDistinctValueOfField(collection as { type: unknown }[], 'type'),
      ).toBe(2);
    });
  });
});
