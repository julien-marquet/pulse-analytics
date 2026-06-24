import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
