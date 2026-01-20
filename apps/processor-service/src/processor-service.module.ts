import { Module } from '@nestjs/common';
import { AlertController } from './controllers/alert.controller';
import { AlertService } from './services/alert.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CoreModule } from '@air-monitor/core';
import { AlertConsumer } from './consumers/alert.consumer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertEntity } from './entities/alert.entity';
import { HealthModule } from './health/health.module';
import { EventsGateway } from './gateways/events.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILE || '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    CoreModule,
    TypeOrmModule.forFeature([AlertEntity]),
    HealthModule,
  ],
  controllers: [AlertController, AlertConsumer],
  providers: [AlertService, EventsGateway],
})
export class ProcessorServiceModule {}
