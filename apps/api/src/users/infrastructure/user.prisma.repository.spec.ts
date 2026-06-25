import {
  createPrismaServiceMock,
  PrismaServiceMock,
} from '../../prisma.service.mock';
import { User } from '../domain/user';
import { UserPrismaRepository } from './user.prisma.repository';

const makeUserDbEntry = () => ({
  id: 'user-1',
  email: 'test@example.com',
  passwordHash: 'hashed-password',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
});

describe('UserPrismaRepository', () => {
  let repo: UserPrismaRepository;
  let prisma: PrismaServiceMock;

  beforeEach(() => {
    prisma = createPrismaServiceMock();
    repo = new UserPrismaRepository(prisma);
  });

  describe('create', () => {
    it('should call prisma with the correct data', async () => {
      prisma.user.create.mockResolvedValue(makeUserDbEntry());

      await repo.create({
        id: 'user-1',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
      });

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          id: 'user-1',
          email: 'test@example.com',
          passwordHash: 'hashed-password',
        },
      });
    });

    it('should return a User domain object', async () => {
      prisma.user.create.mockResolvedValue(makeUserDbEntry());

      const result = await repo.create({
        id: 'user-1',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
      });

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe('user-1');
      expect(result.email).toBe('test@example.com');
      expect(result.passwordHash).toBe('hashed-password');
      expect(result.createdAt).toEqual(new Date('2026-01-01T00:00:00.000Z'));
    });
  });
});
