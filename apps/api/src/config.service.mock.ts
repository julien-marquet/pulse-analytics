// config.service.mock.ts
import { ConfigService } from '@nestjs/config';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ConfigVariables } from './config';

export type ConfigServiceMock = DeepMockProxy<ConfigService<ConfigVariables>>;
export const createConfigServiceMock = (
  defaults: ConfigVariables,
): ConfigServiceMock => {
  const mock = mockDeep<ConfigService<ConfigVariables>>();
  mock.get.mockImplementation(
    <T extends keyof ConfigVariables>(key: T) => defaults[key],
  );
  return mock;
};
