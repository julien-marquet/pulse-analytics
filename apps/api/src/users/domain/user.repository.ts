import { User } from './user';

export const USER_REPOSITORY = Symbol('UserRepository');

export interface UserQuery {
  id: string;
  email: string;
  passwordHash: string;
}

export interface UserRepository {
  create(query: UserQuery): Promise<User>;
}
