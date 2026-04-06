import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDefined, IsIn, Validate } from 'class-validator';
import { IsAllowedTimezoneConstraint } from './is-allowed-timezone.validator';

export function IsArrayOfAllowedValues<T extends string[]>(allowedValues: T) {
  return applyDecorators(
    Transform(({ value }) =>
      typeof value === 'string' ? value.split(',') : undefined,
    ),
    IsDefined({ each: true }),
    IsIn(Object.values(allowedValues), { each: true }),
  );
}

export function IsAllowedTimezone() {
  return Validate(IsAllowedTimezoneConstraint);
}
