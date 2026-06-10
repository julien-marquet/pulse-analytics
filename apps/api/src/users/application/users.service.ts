import { Inject, Injectable } from '@nestjs/common';
import {
  USERS_REPOSITORY,
  type UsersRepository,
} from '../domain/users.repository';
import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcryptjs';
import { User } from '@app/database';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly userRepo: UsersRepository,
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    return await this.userRepo.create({
      id: randomUUID(),
      email,
      passwordHash: await bcrypt.hash(password, 10),
    });
  }
}
