import { User } from './user';

export const USERS_REPOSITORY = Symbol('UsersRepository');

export interface UserQuery {
  id: string;
  email: string;
  passwordHash: string;
}

export interface UsersRepository {
  create(query: UserQuery): Promise<User>;
}
