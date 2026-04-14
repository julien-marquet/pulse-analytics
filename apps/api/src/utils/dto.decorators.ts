import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDefined, IsNotEmpty, Validate } from 'class-validator';
import { IsAllowedTimezoneConstraint } from './is-allowed-timezone.validator';
import { IsJsonObjectConstraint } from './is-json-object.validator';

export function IsStringArray() {
  return applyDecorators(
    Transform(({ value }) =>
      typeof value === 'string' ? value.split(',') : undefined,
    ),
    IsDefined({ each: true }),
    IsNotEmpty({ each: true }),
  );
}

export function IsAllowedTimezone() {
  return Validate(IsAllowedTimezoneConstraint);
}

export function IsJsonObject() {
  return Validate(IsJsonObjectConstraint);
}
