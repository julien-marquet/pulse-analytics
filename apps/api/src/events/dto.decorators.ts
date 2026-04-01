import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDefined, IsIn } from 'class-validator';

export function IsArrayOfAllowedValues<T extends string[]>(allowedValues: T) {
  return applyDecorators(
    Transform(({ value }) =>
      typeof value === 'string' ? value.split(',') : undefined,
    ),
    IsDefined({ each: true }),
    IsIn(Object.values(allowedValues), { each: true }),
  );
}
