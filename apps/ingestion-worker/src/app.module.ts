import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { environment } from './environment';
import { TypedConfigModule } from '@app/common';
import { ConfigVariables } from './config';
import { LoggerModule } from 'nestjs-pino';
import pretty from 'pino-pretty';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventModule } from './event/event.module';
import { EventStatsModule } from './event-stats/event-stats.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
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
    EventModule,
    EventStatsModule,
  ],
})
export class AppModule {}
