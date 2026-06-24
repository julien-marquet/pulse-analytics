import { Timing } from './timing';

describe('Timing', () => {
  const emittedAt = new Date('2026-01-01T00:00:00.000Z');
  const receivedAt = new Date('2026-01-01T00:00:00.200Z');
  const processedAt = new Date('2026-01-01T00:00:00.350Z');

  it('should create a Timing when dates are in order', () => {
    const timing = Timing.create(emittedAt, receivedAt, processedAt);

    expect(timing.emittedAt).toEqual(emittedAt);
    expect(timing.receivedAt).toEqual(receivedAt);
    expect(timing.processedAt).toEqual(processedAt);
  });

  it('should create a Timing when all dates are equal', () => {
    const ts = new Date('2026-01-01T00:00:00.000Z');
    expect(() => Timing.create(ts, ts, ts)).not.toThrow();
  });

  it('should throw when emittedAt is after receivedAt', () => {
    expect(() =>
      Timing.create(
        new Date('2026-01-01T00:00:01.000Z'),
        new Date('2026-01-01T00:00:00.000Z'),
        new Date('2026-01-01T00:00:02.000Z'),
      ),
    ).toThrow('emittedAt');
  });

  it('should throw when receivedAt is after processedAt', () => {
    expect(() =>
      Timing.create(
        new Date('2026-01-01T00:00:00.000Z'),
        new Date('2026-01-01T00:00:02.000Z'),
        new Date('2026-01-01T00:00:01.000Z'),
      ),
    ).toThrow('receivedAt');
  });
});
