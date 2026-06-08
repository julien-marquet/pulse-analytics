import { weightedStats } from './aggregate.utils';

describe('weightedStats', () => {
  it('should compute total and average across multiple items', () => {
    const items = [
      { n: 2, value: 100 },
      { n: 3, value: 150 },
    ];
    const result = weightedStats(
      items,
      (i) => i.n,
      (i) => i.value,
    );

    expect(result.totalWeight).toBe(5);
    expect(result.average).toBe(50);
  });

  it('should return null average for an empty array', () => {
    const result = weightedStats(
      [],
      () => 0,
      () => 0,
    );

    expect(result.totalWeight).toBe(0);
    expect(result.average).toBeNull();
  });

  it('should return null average when all counts are zero', () => {
    const items = [
      { n: 0, value: 0 },
      { n: 0, value: 200 },
    ];
    const result = weightedStats(
      items,
      (i) => i.n,
      (i) => i.value,
    );

    expect(result.totalWeight).toBe(0);
    expect(result.average).toBeNull();
  });

  it('should handle a single item', () => {
    const items = [{ n: 4, value: 200 }];
    const result = weightedStats(
      items,
      (i) => i.n,
      (i) => i.value,
    );

    expect(result.totalWeight).toBe(4);
    expect(result.average).toBe(50);
  });

  it('should produce a fractional average when not evenly divisible', () => {
    const items = [
      { n: 1, value: 100 },
      { n: 2, value: 100 },
    ];
    const result = weightedStats(
      items,
      (i) => i.n,
      (i) => i.value,
    );

    expect(result.totalWeight).toBe(3);
    expect(result.average).toBeCloseTo(66.67, 2);
  });
});
