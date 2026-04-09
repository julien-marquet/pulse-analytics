// config.service.mock.ts
import { TypedConfigService } from '@app/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ConfigVariables } from './config';

export type ConfigServiceMock = DeepMockProxy<TypedConfigService<ConfigVariables>>;
export const createConfigServiceMock = (
  defaults: ConfigVariables,
): ConfigServiceMock => {
  const mock = mockDeep<TypedConfigService<ConfigVariables>>();
  mock.get.mockImplementation(
    <T extends keyof ConfigVariables>(key: T) => defaults[key],
  );
  return mock;
};
