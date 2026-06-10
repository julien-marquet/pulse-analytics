import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';
import { User } from '../domain/user';
import { type UsersRepository } from '../domain/users.repository';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepo: jest.Mocked<UsersRepository>;

  beforeEach(() => {
    usersRepo = { create: jest.fn() };
    service = new UsersService(usersRepo);
  });

  describe('createUser', () => {
    it('should call the repository with the provided email', async () => {
      usersRepo.create.mockResolvedValue(
        new User('id', 'test@example.com', 'hash', new Date()),
      );

      await service.createUser('test@example.com', 'secret');

      expect(usersRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com' }),
      );
    });

    it('should pass a valid uuid as id', async () => {
      usersRepo.create.mockResolvedValue(
        new User('id', 'test@example.com', 'hash', new Date()),
      );

      await service.createUser('test@example.com', 'secret');

      const { id } = usersRepo.create.mock.calls[0][0];
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it('should generate a unique id on each call', async () => {
      usersRepo.create.mockResolvedValue(
        new User('id', 'test@example.com', 'hash', new Date()),
      );

      await service.createUser('a@example.com', 'secret');
      await service.createUser('b@example.com', 'secret');

      const id1 = usersRepo.create.mock.calls[0][0].id;
      const id2 = usersRepo.create.mock.calls[1][0].id;
      expect(id1).not.toBe(id2);
    });

    it('should not store the plain password', async () => {
      usersRepo.create.mockResolvedValue(
        new User('id', 'test@example.com', 'hash', new Date()),
      );

      await service.createUser('test@example.com', 'secret');

      const { passwordHash } = usersRepo.create.mock.calls[0][0];
      expect(passwordHash).not.toBe('secret');
    });

    it('should store a valid bcrypt hash of the password', async () => {
      usersRepo.create.mockResolvedValue(
        new User('id', 'test@example.com', 'hash', new Date()),
      );

      await service.createUser('test@example.com', 'secret');

      const { passwordHash } = usersRepo.create.mock.calls[0][0];
      expect(await bcrypt.compare('secret', passwordHash)).toBe(true);
    });

    it('should return the user from the repository', async () => {
      const user = new User('user-1', 'test@example.com', 'hash', new Date());
      usersRepo.create.mockResolvedValue(user);

      const result = await service.createUser('test@example.com', 'secret');

      expect(result).toBe(user);
    });
  });
});
