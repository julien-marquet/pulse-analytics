export class EventCandidate {
  readonly id: string;
  readonly type: string;
  readonly properties: Record<string, unknown>;
  readonly emittedAt: Date;

  constructor(data: {
    id: string;
    type: string;
    properties: Record<string, unknown>;
    emittedAt: Date;
  }) {
    this.id = data.id;
    this.type = data.type;
    this.properties = data.properties;
    this.emittedAt = data.emittedAt;
  }
}
