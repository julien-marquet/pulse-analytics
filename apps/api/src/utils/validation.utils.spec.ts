import { BadRequestException } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { validateAndTransformPayload } from './validation.utils';

class TestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
  role: string = 'default';
}

describe('validateAndTransformPayload', () => {
  it('returns a transformed instance when the payload is valid', async () => {
    const result = await validateAndTransformPayload(
      { name: 'Alice', age: 30 },
      TestDto,
    );

    expect(result).toBeInstanceOf(TestDto);
    expect(result.name).toBe('Alice');
    expect(result.age).toBe(30);
  });

  it('applies exposeDefaultValues — populates default when field is absent', async () => {
    const result = await validateAndTransformPayload(
      { name: 'Alice', age: 30 },
      TestDto,
    );

    expect(result.role).toBe('default');
  });

  it('applies enableImplicitConversion — coerces a string number to number', async () => {
    const result = await validateAndTransformPayload(
      { name: 'Alice', age: '30' },
      TestDto,
    );

    expect(result.age).toBe(30);
  });

  it('throws BadRequestException when a required field is missing', async () => {
    await expect(
      validateAndTransformPayload({ age: 30 }, TestDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when a field has the wrong type and cannot be coerced', async () => {
    await expect(
      validateAndTransformPayload({ name: '', age: 30 }, TestDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException for non-whitelisted extra fields', async () => {
    await expect(
      validateAndTransformPayload(
        { name: 'Alice', age: 30, extra: 'unwanted' },
        TestDto,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException with validation errors in the response', async () => {
    let exception: BadRequestException | undefined;
    try {
      await validateAndTransformPayload({ age: 30 }, TestDto);
    } catch (e) {
      exception = e as BadRequestException;
    }

    const response = exception!.getResponse() as { message: unknown[] };
    expect(Array.isArray(response.message)).toBe(true);
    expect(response.message.length).toBeGreaterThan(0);
  });
});
