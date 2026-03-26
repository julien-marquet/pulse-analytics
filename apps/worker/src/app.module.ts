import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { EventProcessor } from './event.processor';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'event',
    }),
  ],
  providers: [EventProcessor, PrismaService],
})
export class AppModule {}
