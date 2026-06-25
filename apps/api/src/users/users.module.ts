import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { UsersController } from './presentation/users.controller';
import { UsersService } from './application/users.service';
import { USER_REPOSITORY } from './domain/user.repository';
import { UserPrismaRepository } from './infrastructure/user.prisma.repository';

@Module({
  providers: [
    PrismaService,
    { provide: USER_REPOSITORY, useClass: UserPrismaRepository },
    UsersService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
