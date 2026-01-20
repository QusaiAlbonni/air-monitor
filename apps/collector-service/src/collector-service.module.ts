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
import { RULES_LIST_TOKEN } from './validators/constants';
import { AqiRule } from './validators/rules/aqi.rule';
import { PollutantThresholdRule } from './validators/rules/pollutant.rule';
import { ReadingValidator } from './validators/reading.validator';
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
    ReadingValidator,
    {
      provide: RULES_LIST_TOKEN,
      useValue: [new AqiRule(), new PollutantThresholdRule()],
    },
  ],
})
export class CollectorServiceModule {}
