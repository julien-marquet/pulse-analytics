/**
 * Parses a `yyyy-mm-dd` date string and returns a Date at UTC midnight.
 * @param dateString - A date string in `yyyy-mm-dd` format.
 * @returns A Date representing midnight UTC on the given date.
 */
export function parseUTCDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number);
  const utcMidnight = new Date(Date.UTC(year, month - 1, day));
  return utcMidnight;
}

/**
 * Returns a Date representing UTC midnight of the calendar date
 * that `date` falls on in the given IANA timezone.
 *
 * @param date - The source date/time.
 * @param timeZone - An IANA timezone name (e.g. `"America/New_York"`).
 * @returns A Date at UTC midnight of the local calendar date in that timezone.
 *
 * @example
 * // 2026-03-31 01:00 UTC is still 2026-03-30 in New York (UTC-4)
 * startOfDayUTC(new Date('2026-03-31T01:00:00Z'), 'America/New_York');
 * // → 2026-03-30T00:00:00.000Z
 */
export function startOfDayUTC(date: Date, timeZone: string): Date {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const year = parseInt(parts.find(p => p.type === 'year')!.value);
  const month = parseInt(parts.find(p => p.type === 'month')!.value);
  const day = parseInt(parts.find(p => p.type === 'day')!.value);

  return new Date(Date.UTC(year, month - 1, day));
}