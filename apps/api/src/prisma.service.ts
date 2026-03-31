import { Injectable } from '@nestjs/common';
import { PrismaClient, PrismaPg } from '@app/database';
import { environment } from './environment';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: environment.get('DATABASE_URL'),
    });
    super({ adapter });
  }
}
