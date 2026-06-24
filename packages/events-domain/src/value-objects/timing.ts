export class Timing {
  readonly emittedAt: Date;
  readonly receivedAt: Date;
  readonly processedAt: Date;

  private constructor(emittedAt: Date, receivedAt: Date, processedAt: Date) {
    this.emittedAt = emittedAt;
    this.receivedAt = receivedAt;
    this.processedAt = processedAt;
  }

  static create(
    emittedAt: Date,
    receivedAt: Date,
    processedAt: Date,
  ): Timing {
    if (emittedAt > receivedAt) {
      throw new Error(
        `emittedAt (${emittedAt.toISOString()}) must be <= receivedAt (${receivedAt.toISOString()})`,
      );
    }
    if (receivedAt > processedAt) {
      throw new Error(
        `receivedAt (${receivedAt.toISOString()}) must be <= processedAt (${processedAt.toISOString()})`,
      );
    }
    return new Timing(emittedAt, receivedAt, processedAt);
  }
}
