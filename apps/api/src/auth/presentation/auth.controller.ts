import { Controller, Post } from '@nestjs/common';
import { LoginRequestDto } from './dtos/login.request.dto';
import { AuthService } from '../application/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(query: LoginRequestDto) {
    await this.authService.createTokens(query.email, query.password);
  }
}
