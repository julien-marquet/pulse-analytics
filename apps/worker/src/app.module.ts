import { Module } from '@nestjs/common';
import { EventProcessor } from './event.processor';
import { PrismaService } from './prisma.service';
import { BullModule } from '@nestjs/bullmq';
import { environment } from './environment';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        url: environment.get('REDIS_URL'),
      },
    }),
    BullModule.registerQueue({ name: environment.get('EVENT_QUEUE_NAME') }),
  ],
  providers: [PrismaService, EventProcessor],
})
export class AppModule {}
