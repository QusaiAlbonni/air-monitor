import { airQualityAlertFormatter } from '@air-monitor/air-quality/logging/formatters/air-quality-alert.formatter';
import { ConfigService } from '@nestjs/config';
import {
  WinstonModuleOptions,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';

export function createWinstonLogger(
  configService: ConfigService,
): WinstonModuleOptions {
  const transports: winston.transport[] = [];

  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.prettyPrint(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
  );

  return {
    format: winston.format.combine(
      airQualityAlertFormatter(),
      winston.format.timestamp(),
      winston.format.json(),
    ),
    transports,
  };
}
