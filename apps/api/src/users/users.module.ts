import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { UsersController } from './presentation/users.controller';
import { UsersService } from './application/users.service';
import { USERS_REPOSITORY } from './domain/users.repository';
import { UsersPrismaRepository } from './infrastructure/users.prisma.repository';

@Module({
  providers: [
    PrismaService,
    { provide: USERS_REPOSITORY, useClass: UsersPrismaRepository },
    UsersService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
