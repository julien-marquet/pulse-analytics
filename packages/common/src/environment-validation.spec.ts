import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { validateEnvironment } from './environment-validation';

class StrictVariables {
  @IsString()
  @IsNotEmpty()
  APP_NAME: string;

  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  PORT: number;
}

describe('validateEnvironment', () => {
  it('should return a validated instance when all required variables are present and valid', () => {
    const result = validateEnvironment(StrictVariables, {
      APP_NAME: 'my-app',
      PORT: '3000',
    });

    expect(result).toBeInstanceOf(StrictVariables);
    expect(result.APP_NAME).toBe('my-app');
    expect(result.PORT).toBe(3000);
  });

  it('should throw when a required variable is missing', () => {
    expect(() =>
      validateEnvironment(StrictVariables, { PORT: '3000' }),
    ).toThrow('Environment Validations Failed');
  });

  it('should throw when a variable fails validation', () => {
    expect(() =>
      validateEnvironment(StrictVariables, { APP_NAME: 'my-app', PORT: '0' }),
    ).toThrow('Environment Validations Failed');
  });

  it('should throw when the payload is empty', () => {
    expect(() => validateEnvironment(StrictVariables, {})).toThrow(
      'Environment Validations Failed',
    );
  });

  it('should apply class-transformer transforms', () => {
    const result = validateEnvironment(StrictVariables, {
      APP_NAME: 'my-app',
      PORT: '8080',
    });

    expect(typeof result.PORT).toBe('number');
    expect(result.PORT).toBe(8080);
  });

  it('should ignore extra keys in the payload', () => {
    const result = validateEnvironment(StrictVariables, {
      APP_NAME: 'my-app',
      PORT: '3000',
      UNKNOWN_VAR: 'ignored',
    });

    expect(result).toBeInstanceOf(StrictVariables);
    expect(
      (result as unknown as Record<string, unknown>).UNKNOWN_VAR,
    ).toBeUndefined();
  });
});
