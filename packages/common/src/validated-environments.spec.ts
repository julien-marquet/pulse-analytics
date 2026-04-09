import { IsNotEmpty, IsString } from 'class-validator';
import { ValidatedEnvironment } from './validated-environments';

class TestVariables {
  @IsString()
  @IsNotEmpty()
  APP_NAME: string;

  @IsString()
  @IsNotEmpty()
  APP_SECRET: string;
}

describe('ValidatedEnvironment', () => {
  const REQUIRED_KEYS: (keyof TestVariables)[] = ['APP_NAME', 'APP_SECRET'];

  beforeEach(() => {
    process.env.APP_NAME = 'my-app';
    process.env.APP_SECRET = 'secret';
  });

  afterEach(() => {
    REQUIRED_KEYS.forEach((key) => delete process.env[key]);
  });

  describe('constructor', () => {
    it('should construct successfully when all required variables are present', () => {
      expect(() => new ValidatedEnvironment(TestVariables)).not.toThrow();
    });

    it('should throw when a required variable is missing', () => {
      delete process.env.APP_NAME;

      expect(() => new ValidatedEnvironment(TestVariables)).toThrow(
        'Environment Validations Failed',
      );
    });

    it('should throw when a required variable is empty', () => {
      process.env.APP_NAME = '';

      expect(() => new ValidatedEnvironment(TestVariables)).toThrow(
        'Environment Validations Failed',
      );
    });
  });

  describe('get', () => {
    it('should return the value of the requested key', () => {
      const env = new ValidatedEnvironment(TestVariables);

      expect(env.get('APP_NAME')).toBe('my-app');
      expect(env.get('APP_SECRET')).toBe('secret');
    });
  });
});
