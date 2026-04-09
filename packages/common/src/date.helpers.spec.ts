import { DatePrismaConverter, getUTCMidnightForTimezone } from './date.helpers';

describe('DateHelpers', () => {
  describe('getUTCMidnightForTimezone', () => {
    it('returns UTC midnight of the same calendar day when timezone is UTC', () => {
      const date = new Date('2026-04-01T10:30:00Z');
      expect(getUTCMidnightForTimezone(date, 'UTC')).toEqual(
        new Date('2026-04-01T00:00:00.000Z'),
      );
    });

    it('defaults to UTC when no timezone is provided', () => {
      const date = new Date('2026-04-01T23:59:59Z');
      expect(getUTCMidnightForTimezone(date)).toEqual(
        new Date('2026-04-01T00:00:00.000Z'),
      );
    });

    it('returns previous calendar day midnight when UTC time is past local midnight (UTC- offset)', () => {
      // 2026-03-31T01:00:00Z is still March 30 in New York (EDT = UTC-4)
      const date = new Date('2026-03-31T01:00:00Z');
      expect(getUTCMidnightForTimezone(date, 'America/New_York')).toEqual(
        new Date('2026-03-30T00:00:00.000Z'),
      );
    });

    it('returns next calendar day midnight when UTC time has not yet reached local day start (UTC+ offset)', () => {
      // 2026-03-31T20:00:00Z is already April 1 in Tokyo (UTC+9)
      const date = new Date('2026-03-31T20:00:00Z');
      expect(getUTCMidnightForTimezone(date, 'Asia/Tokyo')).toEqual(
        new Date('2026-04-01T00:00:00.000Z'),
      );
    });
  });

  describe('DatePrismaConverter.toPrisma', () => {
    it('returns a Date at UTC midnight for the given date string', () => {
      expect(DatePrismaConverter.toPrisma('2026-04-01')).toEqual(
        new Date('2026-04-01T00:00:00.000Z'),
      );
    });

    it('returns a Date instance', () => {
      expect(DatePrismaConverter.toPrisma('2026-04-01')).toBeInstanceOf(Date);
    });

    it('forces UTC interpretation to avoid local timezone offset drift', () => {
      const result = DatePrismaConverter.toPrisma('2025-12-31');
      expect(result.toISOString()).toBe('2025-12-31T00:00:00.000Z');
    });

    it('handles a leap day', () => {
      expect(DatePrismaConverter.toPrisma('2024-02-29')).toEqual(
        new Date('2024-02-29T00:00:00.000Z'),
      );
    });
  });

  describe('DatePrismaConverter.fromPrismaToDateString', () => {
    it('returns the same date string for the UTC default timezone', () => {
      const prismaDate = new Date('2026-04-01T00:00:00.000Z');
      expect(DatePrismaConverter.fromPrismaToDateString(prismaDate)).toBe(
        '2026-04-01',
      );
    });

    it('returns the calendar date of local midnight reinterpreted in a UTC- timezone', () => {
      // Components of 2026-04-01T00:00:00Z treated as New York midnight (UTC-4 EDT)
      // → fromZonedTime produces 2026-04-01T04:00:00Z → formats as "2026-04-01"
      const prismaDate = new Date('2026-04-01T00:00:00.000Z');
      expect(
        DatePrismaConverter.fromPrismaToDateString(
          prismaDate,
          'America/New_York',
        ),
      ).toBe('2026-04-01');
    });
  });

  describe('DatePrismaConverter.fromPrismaToDate', () => {
    it('returns the same Date when timezone is UTC (default)', () => {
      const prismaDate = new Date('2026-04-01T00:00:00.000Z');
      expect(DatePrismaConverter.fromPrismaToDate(prismaDate)).toEqual(
        prismaDate,
      );
    });

    it('returns a Date instance', () => {
      expect(DatePrismaConverter.fromPrismaToDate(new Date())).toBeInstanceOf(
        Date,
      );
    });

    it('reinterprets UTC midnight components as local midnight in a UTC- timezone (America/New_York)', () => {
      // Midnight April 1 in New York (EDT = UTC-4) = 2026-04-01T04:00:00Z
      const prismaDate = new Date('2026-04-01T00:00:00.000Z');
      expect(
        DatePrismaConverter.fromPrismaToDate(prismaDate, 'America/New_York'),
      ).toEqual(new Date('2026-04-01T04:00:00.000Z'));
    });

    it('reinterprets UTC midnight components as local midnight in a UTC+ timezone (Asia/Tokyo)', () => {
      // Midnight April 1 in Tokyo (UTC+9) = 2026-03-31T15:00:00Z
      const prismaDate = new Date('2026-04-01T00:00:00.000Z');
      expect(
        DatePrismaConverter.fromPrismaToDate(prismaDate, 'Asia/Tokyo'),
      ).toEqual(new Date('2026-03-31T15:00:00.000Z'));
    });
  });
});
