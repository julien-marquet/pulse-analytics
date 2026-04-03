type CollectionWithKey<T extends string> = {
  [K in T]: unknown;
}[];

export function countDistinctValueOfField<T extends string>(
  collection: CollectionWithKey<T>,
  key: T,
): number {
  const set = new Set();
  for (const entry of collection) {
    set.add(entry[key]);
  }
  return set.size;
}
