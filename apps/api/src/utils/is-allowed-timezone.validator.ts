// utils/is-allowed-timezone.validator.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ConfigVariables } from '../config';

@Injectable()
@ValidatorConstraint({ name: 'isAllowedTimezone', async: false })
export class IsAllowedTimezoneConstraint implements ValidatorConstraintInterface {
  constructor(private config: ConfigService<ConfigVariables>) {}

  validate(value: string) {
    return this.config.get('TIMEZONES', { infer: true })!.includes(value);
  }

  defaultMessage() {
    return `$property must be one of the configured timezones`;
  }
}
