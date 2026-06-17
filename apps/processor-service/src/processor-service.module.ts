import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from '@air-monitor/core';
import { HealthModule } from './health/health.module';
import { AlertModule } from './alert/alert.module';
import { DatabaseModule } from '@app/database';
import { MessagingModule } from '@air-monitor/messaging';
import { InboxModule } from './inbox/inbox.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { NewAirQualityAlertCommandHandler } from './alert/command-handlers/new-air-quality-alert.command-handler';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILE || '.env',
      isGlobal: true,
    }),
    DatabaseModule.forRoot(__dirname + '/**/*.entity.{ts,js}'),
    CoreModule,
    MessagingModule,
    InboxModule,
    HealthModule,
    CqrsModule.forRoot(),
    AlertModule,
    ScheduleModule.forRoot(),
  ],
})
export class ProcessorServiceModule {}
