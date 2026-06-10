import { BadRequestException } from '@nestjs/common';
import { validateAndTransformPayload } from '../../../utils/validation.utils';
import { CreateUserRequestDto } from './create-user.request.dto';

const makeValidPayload = () => ({
  email: 'user@example.com',
  password: 'secret123',
});

describe('CreateUserRequestDto', () => {
  it('should pass for a valid payload', async () => {
    const result = await validateAndTransformPayload(
      makeValidPayload(),
      CreateUserRequestDto,
    );
    expect(result).toBeInstanceOf(CreateUserRequestDto);
  });

  describe('email', () => {
    it('should throw when email is missing', async () => {
      const { email: _, ...payload } = makeValidPayload();
      await expect(
        validateAndTransformPayload(payload, CreateUserRequestDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when email is not a valid email', async () => {
      await expect(
        validateAndTransformPayload(
          { ...makeValidPayload(), email: 'not-an-email' },
          CreateUserRequestDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when email is an empty string', async () => {
      await expect(
        validateAndTransformPayload(
          { ...makeValidPayload(), email: '' },
          CreateUserRequestDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('password', () => {
    it('should throw when password is missing', async () => {
      const { password: _, ...payload } = makeValidPayload();
      await expect(
        validateAndTransformPayload(payload, CreateUserRequestDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when password is an empty string', async () => {
      await expect(
        validateAndTransformPayload(
          { ...makeValidPayload(), password: '' },
          CreateUserRequestDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
