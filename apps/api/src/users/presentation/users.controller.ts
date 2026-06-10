import { Controller, Post, Body } from '@nestjs/common';
import { ValidationPipe } from '../../validation.pipe';
import { CreateUserRequestDto } from './dtos/create-user.request.dto';
import { UsersService } from '../application/users.service';
import { CreateUserResponseDto } from './dtos/create-user.response.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async CreateUser(
    @Body(ValidationPipe) query: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const createdUser = await this.usersService.createUser(
      query.email,
      query.password,
    );
    return {
      id: createdUser.id,
    };
  }
}
