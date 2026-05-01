import { Module } from '@nestjs/common';
import { EventProcessor } from './event.processor';
import { PrismaService } from './prisma.service';
import { BullModule } from '@nestjs/bullmq';
import { environment } from './environment';
import { EventPersistenceService } from './event-persistence.service';
import { TypedConfigModule } from '@app/common';
import { ConfigVariables } from './config';
import { LoggerModule } from 'nestjs-pino';
import pretty from 'pino-pretty';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: [
        {
          autoLogging: false,
          level: process.env.LOG_LEVEL || 'info',
        },
        process.env.NODE_ENV !== 'production'
          ? pretty({
              colorize: true,
              translateTime: 'HH:MM:ss',
              ignore: 'pid,hostname',
              singleLine: true,
            })
          : process.stdout,
      ],
      forRoutes: [],
    }),
    TypedConfigModule.forRoot(ConfigVariables),
    BullModule.forRoot({
      connection: {
        url: environment.get('REDIS_URL'),
      },
    }),
    BullModule.registerQueue({
      name: environment.get('EVENT_QUEUE_NAME'),
    }),
  ],
  providers: [PrismaService, EventPersistenceService, EventProcessor],
})
export class AppModule {}
