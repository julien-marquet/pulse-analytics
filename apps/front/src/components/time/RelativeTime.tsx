'use client';
import { DateTime } from 'luxon';

export function RelativeTime({ iso }: { iso: string }) {
  return <>{DateTime.fromISO(iso).toRelative()}</>;
}
