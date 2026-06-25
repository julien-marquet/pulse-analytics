import { User as DbUser } from '@app/database';
import { PrismaService } from '../../prisma.service';
import { User } from '../domain/user';
import { UserQuery, UserRepository } from '../domain/user.repository';

export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(query: UserQuery): Promise<User> {
    const dbUser = await this.prisma.user.create({
      data: {
        id: query.id,
        email: query.email,
        passwordHash: query.passwordHash,
      },
    });
    return this.toDomain(dbUser);
  }

  private toDomain(dbUser: DbUser): User {
    return new User(
      dbUser.id,
      dbUser.email,
      dbUser.passwordHash,
      dbUser.createdAt,
    );
  }
}
