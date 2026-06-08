export function weightedStats<T>(
  items: T[],
  getWeight: (item: T) => number,
  getValue: (item: T) => number,
): { totalWeight: number; average: number | null } {
  let totalWeight = 0,
    totalValue = 0;
  for (const item of items) {
    totalWeight += getWeight(item);
    totalValue += getValue(item);
  }
  return {
    totalWeight,
    average: totalWeight === 0 ? null : totalValue / totalWeight,
  };
}
