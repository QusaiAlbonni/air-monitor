import { CoreModule } from '@air-monitor/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CollectorService } from './services/collector.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PollAirQualityDataTask } from './tasks';
import { PlaceService } from './services/place.service';
import { AirQualityModule } from '@air-monitor/air-quality';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from '@app/database';
import { OutboxModule } from './outbox/outbox.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILE || '.env',
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    AirQualityModule,
    CoreModule,
    DatabaseModule.forRoot(__dirname + '/**/*.entity.{ts,js}'),
    OutboxModule,
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
