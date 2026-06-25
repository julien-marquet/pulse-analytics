import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { useContainer } from 'class-validator';
import { UsersController } from './users.controller';
import { UsersService } from '../application/users.service';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../domain/user.repository';

describe('UsersController (integration)', () => {
  let app: INestApplication;
  let usersRepo: jest.Mocked<UserRepository>;

  beforeAll(async () => {
    usersRepo = {
      create: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: USER_REPOSITORY, useValue: usersRepo },
      ],
    }).compile();

    useContainer(moduleRef, { fallbackOnErrors: true });
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(() => app.close());

  beforeEach(() => jest.clearAllMocks());

  describe('POST /users', () => {
    it('returns 201 with the created user id', async () => {
      usersRepo.create.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        passwordHash: 'hash',
        createdAt: new Date(),
      });

      return request(app.getHttpServer())
        .post('/users')
        .send({ email: 'test@example.com', password: 'secret123' })
        .expect(201)
        .expect(({ body }) => {
          expect(body.id).toBe('user-1');
        });
    });

    it('returns 400 when email is missing', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ password: 'secret123' })
        .expect(400);
    });

    it('returns 400 when email is invalid', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ email: 'not-an-email', password: 'secret123' })
        .expect(400);
    });

    it('returns 400 when password is missing', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ email: 'test@example.com' })
        .expect(400);
    });
  });
});
