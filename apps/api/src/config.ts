import { IsTimezoneList } from '@app/common';

export class ConfigVariables {
  @IsTimezoneList()
  TIMEZONES: string[];
}
