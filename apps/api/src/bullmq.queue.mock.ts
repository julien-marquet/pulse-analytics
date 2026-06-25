import { Queue } from 'bullmq';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PublishEventDto } from './events/infrastructure/dtos/publish-event.dto';

export type BullmqQueueMock = DeepMockProxy<Queue<PublishEventDto>>;
export const createBullmqQueueMock = (): BullmqQueueMock =>
  mockDeep<Queue<PublishEventDto>>();
