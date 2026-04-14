import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isJsonObject', async: false })
export class IsJsonObjectConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return false;
    }
    try {
      JSON.stringify(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return '$property must be a JSON serializable object';
  }
}
