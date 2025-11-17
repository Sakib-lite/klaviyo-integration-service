import {
  WinstonModuleOptions,
  WinstonModuleOptionsFactory,
} from 'nest-winston/dist/winston.interfaces';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');
import { ConfigKey } from '../app-config/app-config';
import { API_SERVER_NAME } from './constants';
import { AppEnvironment } from 'src/@core/constants/app-constants';

const processLogEntry = winston.format(
  (info: winston.Logform.TransformableInfo) => {
    if (
      (info as any)?.stack?.length &&
      !(info as any)?.error?.stack?.length &&
      (info as any)?.error?.hasOwnProperty('stack')
    ) {
      (info as any).error.stack = (info as any)['stack'];
    }
    delete (info as any)['stack'];

    if (!info.hasOwnProperty('@timestamp')) {
      (info as any)['@timestamp'] = new Date().toISOString();
    }
    if (!info.hasOwnProperty('application')) {
      (info as any)['application'] = API_SERVER_NAME;
    }

    return info;
  },
);

const removeRouterLog = winston.format(
  (info: winston.Logform.TransformableInfo) => {
    if (
      ['RoutesResolver', 'RouterExplorer', 'NestApplication'].includes(
        (info as any).context,
      )
    ) {
      return false;
    }
    return info;
  },
);

const onlyUserLog = winston.format(
  (info: winston.Logform.TransformableInfo) => {
    if ((info as any).log_type != 'user_event') {
      return false;
    }
    return info;
  },
);

const excludeUserLog = winston.format(
  (info: winston.Logform.TransformableInfo) => {
    if ((info as any).log_type == 'user_event') {
      return false;
    }
    return info;
  },
);

@Injectable()
export class WinstonConfigService implements WinstonModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createWinstonModuleOptions():
    | Promise<WinstonModuleOptions>
    | WinstonModuleOptions {
    const transports: winston.transport[] = [
      new DailyRotateFile({
        filename: `logs/logs-%DATE%.log`,
        format: winston.format.combine(
          removeRouterLog(),
          excludeUserLog(),
          processLogEntry(),
          winston.format.json(),
        ),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxFiles: '30d',
      }),
      new DailyRotateFile({
        filename: `logs/user-log-%DATE%.log`,
        format: winston.format.combine(
          removeRouterLog(),
          onlyUserLog(),
          winston.format.json(),
        ),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxFiles: '30d',
      }),
    ];

    if (
      this.configService.get<string>(ConfigKey.APP_ENV) !==
      AppEnvironment.PRODUCTION
    ) {
      transports.push(
        new winston.transports.Console({
          level: 'silly',
          format: winston.format.combine(
            winston.format.cli(),
            winston.format.splat(),
            winston.format.timestamp(),
            removeRouterLog(),
            excludeUserLog(),
            winston.format.printf((info: winston.Logform.TransformableInfo) => {
              const timestamp = new Date(
                (info as any).timestamp,
              ).toLocaleString();
              return `${timestamp} ${info.level}: ${info.message} ${(info as any)?.stack || ''}`;
            }),
          ),
        }),
      );
    }

    return {
      exitOnError: true,
      exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exceptions.log' }),
      ],
      rejectionHandlers: [
        new winston.transports.File({ filename: 'logs/rejections.log' }),
      ],
      handleExceptions: true,
      handleRejections: true,
      transports: [...transports],
    };
  }
}
