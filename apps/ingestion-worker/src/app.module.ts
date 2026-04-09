import { Module } from '@nestjs/common';
import { EventProcessor } from './event.processor';
import { PrismaService } from './prisma.service';
import { BullModule } from '@nestjs/bullmq';
import { environment } from './environment';
import { EventPersistenceService } from './event-persistence.service';
import { TypedConfigModule } from '@app/common';
import { ConfigVariables } from './config';

@Module({
  imports: [
    TypedConfigModule.forRoot(ConfigVariables),
    BullModule.forRoot({
      connection: {
        url: environment.get('REDIS_URL'),
      },
    }),
    BullModule.registerQueue({ name: environment.get('EVENT_QUEUE_NAME') }),
  ],
  providers: [PrismaService, EventPersistenceService, EventProcessor],
})
export class AppModule {}
