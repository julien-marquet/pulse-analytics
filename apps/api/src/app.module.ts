import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { TypedConfigModule } from '@app/common';
import { ConfigVariables } from './config';
import { IsAllowedTimezoneConstraint } from './utils/is-allowed-timezone.validator';
import { LoggerModule } from 'nestjs-pino';
import pretty from 'pino-pretty';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: [
        {
          autoLogging: true,
          level: process.env.LOG_LEVEL || 'info',
          serializers: {
            req: (req) => ({ method: req.method, url: req.url }),
            res: (res) => ({ statusCode: res.statusCode }),
          },
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
      forRoutes: ['*'],
    }),
    EventsModule,
    TypedConfigModule.forRoot(ConfigVariables),
  ],
  controllers: [AppController],
  providers: [AppService, IsAllowedTimezoneConstraint],
})
export class AppModule {}
