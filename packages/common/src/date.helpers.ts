import { format,  fromZonedTime } from 'date-fns-tz'

/**
 * Converters for Prisma fields backed by the Postgres native `@db.Date` type.
 *
 * Postgres `DATE` columns store only a calendar date (no time, no timezone).
 * Prisma represents them as `Date` objects set to UTC midnight
 * (e.g. `2026-04-01T00:00:00.000Z`). These helpers ensure values round-trip
 * correctly without date drift caused by timezone offsets.
 */
export const DatePrismaConverter = {
  /**
   * Converts a date string to the `Date` Prisma expects for a `@db.Date` field.
   *
   * Explicitly appends `T00:00:00.000Z` to force UTC interpretation, preventing
   * the `Date` constructor from applying a local timezone offset that could
   * shift the stored date by one day.
   *
   * @param dateString - An ISO date string (e.g. `"2026-04-01"`).
   * @returns A `Date` at UTC midnight of the given date.
   *
   * @example
   * DatePrismaConverter.toPrisma("2026-04-01");
   * // → 2026-04-01T00:00:00.000Z
   */
  toPrisma: (dateString: string): Date => {
    return new Date(`${dateString}T00:00:00.000Z`);
  },

  /**
   * Converts a `Date` returned by Prisma for a `@db.Date` field into the UTC
   * instant corresponding to midnight of that calendar date in the given timezone.
   *
   * Prisma returns `@db.Date` values as UTC midnight. This method reinterprets
   * that as local midnight in `timeZone`, returning the equivalent UTC instant —
   * useful when the date must represent a day boundary in a specific timezone.
   *
   * @param date - The `Date` returned by Prisma (UTC midnight of the stored date).
   * @param timeZone - An IANA timezone name (e.g. `"America/New_York"`). Defaults to `"UTC"`.
   * @returns A `Date` representing midnight of the same calendar date in `timeZone`, expressed as UTC.
   *
   * @example
   * // Prisma returns 2026-04-01T00:00:00Z for a stored DATE of 2026-04-01
   * DatePrismaConverter.fromPrisma(new Date("2026-04-01T00:00:00Z"), "America/New_York");
   * // → 2026-04-01T04:00:00.000Z  (midnight EDT = UTC+4h)
   */
  fromPrismaToDate: (date: Date, timeZone: string = "UTC"): Date => {
    return fromZonedTime(date, timeZone);
  },

  fromPrismaToDateString: (date: Date, timeZone: string = "UTC"): string => {
    return format(fromZonedTime(date, timeZone), "yyyy-MM-dd")
  }
}

