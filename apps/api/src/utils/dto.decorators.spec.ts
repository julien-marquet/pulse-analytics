import { plainToInstance } from 'class-transformer';
import { useContainer, validate } from 'class-validator';
import { IsAllowedTimezone, IsStringArray } from './dto.decorators';
import { setupIsAllowedTimezoneContainer } from './is-allowed-timezone.test-helpers';

class IsArrayOfAllowedValuesTestDto {
  @IsStringArray()
  values: string[];
}

class IsAllowedTimezoneTestDto {
  @IsAllowedTimezone()
  timezone: string;
}

describe('DtoDecorators', () => {
  describe('IsAllowedTimezone', () => {
    beforeEach(() => {
      useContainer(null!);
    });

    afterEach(() => {
      useContainer(null!);
    });

    it('should pass when the timezone is in the configured list', async () => {
      setupIsAllowedTimezoneContainer(['UTC', 'Europe/Paris']);
      const instance = plainToInstance(IsAllowedTimezoneTestDto, {
        timezone: 'UTC',
      });
      const errors = await validate(instance);
      expect(errors).toHaveLength(0);
    });

    it('should fail when the timezone is not in the configured list', async () => {
      setupIsAllowedTimezoneContainer(['UTC']);
      const instance = plainToInstance(IsAllowedTimezoneTestDto, {
        timezone: 'America/New_York',
      });
      const errors = await validate(instance);
      expect(errors).toHaveLength(1);
    });

    it('should fail for an empty string', async () => {
      setupIsAllowedTimezoneContainer(['UTC']);
      const instance = plainToInstance(IsAllowedTimezoneTestDto, {
        timezone: '',
      });
      const errors = await validate(instance);
      expect(errors).toHaveLength(1);
    });
  });

  describe('IsStringArray', () => {
    it('should split a comma-separated string into an array', () => {
      const instance = plainToInstance(IsArrayOfAllowedValuesTestDto, {
        values: 'a,b',
      });
      expect(instance.values).toEqual(['a', 'b']);
    });

    it('should wrap a single value string into a one-element array', () => {
      const instance = plainToInstance(IsArrayOfAllowedValuesTestDto, {
        values: 'a',
      });
      expect(instance.values).toEqual(['a']);
    });

    it('should pass when all values are string', async () => {
      const instance = plainToInstance(IsArrayOfAllowedValuesTestDto, {
        values: 'a,b',
      });
      const errors = await validate(instance);
      expect(errors).toHaveLength(0);
    });

    it('should fail when the field is missing', async () => {
      const instance = plainToInstance(IsArrayOfAllowedValuesTestDto, {});
      const errors = await validate(instance);
      expect(errors).toHaveLength(1);
    });

    it('should fail when the value is not a string', async () => {
      const instance = plainToInstance(IsArrayOfAllowedValuesTestDto, {
        values: 123, // transform returns undefined for non-strings, which fails IsDefined
      });
      const errors = await validate(instance);
      expect(errors).toHaveLength(1);
    });
  });
});
