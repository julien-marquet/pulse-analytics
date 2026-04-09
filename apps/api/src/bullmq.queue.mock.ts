import { Queue } from 'bullmq';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { CreateEventJobData } from '@app/contracts';

export type BullmqQueueMock = DeepMockProxy<Queue<CreateEventJobData>>;
export const createBullmqQueueMock = (): BullmqQueueMock =>
  mockDeep<Queue<CreateEventJobData>>();
