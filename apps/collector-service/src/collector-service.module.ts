import { CoreModule } from '@air-monitor/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RABBITMQ_QUEUE_NAME } from '@air-monitor/messaging';
import { CollectorService } from './services/collector.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PollAirQualityDataTask } from './tasks';
import { PlaceService } from './services/place.service';
import { AirQualityModule } from '@air-monitor/air-quality';
import { RULES_LIST_TOKEN } from '../../../libs/air-quality/src/validators/constants';
import { AqiRule } from '../../../libs/air-quality/src/validators/rules/aqi.rule';
import { PollutantThresholdRule } from '../../../libs/air-quality/src/validators/rules/pollutant.rule';
import { ReadingValidator } from '../../../libs/air-quality/src/validators/reading.validator';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILE || '.env',
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    AirQualityModule,
    CoreModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    CollectorService,
    PollAirQualityDataTask,
    PlaceService,
  ],
})
export class CollectorServiceModule {}
