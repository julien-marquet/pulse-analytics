import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDefined, Validate } from 'class-validator';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isTimezoneList', async: false })
export class IsTimezoneListConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (!Array.isArray(value) || value.length === 0) return false;
    return value.every((tz) => {
      if (typeof tz !== 'string' || tz.trim() === '') return false;
      try {
        Intl.DateTimeFormat(undefined, { timeZone: tz });
        return true;
      } catch {
        return false;
      }
    });
  }

  defaultMessage(): string {
    return '$property must be a non-empty comma-separated list of valid IANA timezones';
  }
}

export function IsTimezoneList() {
  return applyDecorators(
    Transform(({ value }) =>
      typeof value === 'string' ? value.split(',') : undefined,
    ),
    IsDefined(),
    Validate(IsTimezoneListConstraint),
  );
}
