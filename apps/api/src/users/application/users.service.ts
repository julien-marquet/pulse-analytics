import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../domain/user.repository';
import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcryptjs';
import { User } from '@app/database';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    return await this.userRepo.create({
      id: randomUUID(),
      email,
      passwordHash: await bcrypt.hash(password, 10),
    });
  }
}
