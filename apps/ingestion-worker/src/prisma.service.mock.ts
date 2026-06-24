import { PrismaClient } from '@app/database';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type PrismaServiceMock = DeepMockProxy<PrismaClient>;
export const createPrismaServiceMock = (): PrismaServiceMock =>
  mockDeep<PrismaClient>();
