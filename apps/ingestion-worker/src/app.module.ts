import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { environment } from './environment';
import { TypedConfigModule } from '@app/common';
import { ConfigVariables } from './config';
import { LoggerModule } from 'nestjs-pino';
import pretty from 'pino-pretty';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsModule } from './events/events.module';
import { DailyEventStatsModule } from './daily-event-stats/daily-event-stats.module';

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
    EventsModule,
    DailyEventStatsModule,
  ],
})
export class AppModule {}
