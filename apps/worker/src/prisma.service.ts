import { Injectable } from '@nestjs/common';
import { PrismaClient, PrismaPg } from '@app/database';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });
    super({ adapter });
  }
}
