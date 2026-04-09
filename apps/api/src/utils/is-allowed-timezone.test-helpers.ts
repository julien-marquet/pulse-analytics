// src/is-allowed-timezone.validator.setup.ts
import { useContainer } from 'class-validator';
import { createConfigServiceMock } from '../config.service.mock';
import { IsAllowedTimezoneConstraint } from './is-allowed-timezone.validator';

export const setupIsAllowedTimezoneContainer = (timezones: string[]) => {
  const config = createConfigServiceMock({ TIMEZONES: timezones });
  const constraint = new IsAllowedTimezoneConstraint(config);
  useContainer({
    get: (cls) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      cls === IsAllowedTimezoneConstraint ? constraint : new cls(),
  });
};
