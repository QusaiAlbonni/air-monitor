import { Module } from '@nestjs/common';
import { AlertController } from './alert/controllers/alert.controller';
import { AlertService } from './alert/services/alert.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CoreModule } from '@air-monitor/core';
import { AlertConsumer } from './alert/consumers/alert.consumer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertEntity } from './alert/entities/alert.entity';
import { HealthModule } from './health/health.module';
import { AlertsGateway } from './alert/gateways/alerts.gateway';
import { AlertModule } from './alert/alert.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILE || '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    CoreModule,
    HealthModule,
    AlertModule,
  ],
})
export class ProcessorServiceModule {}
