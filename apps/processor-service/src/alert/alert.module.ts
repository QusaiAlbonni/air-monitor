import { Module } from '@nestjs/common';
import { AlertService } from './services/alert.service';
import { AlertController } from './controllers/alert.controller';
import { AlertConsumer } from './consumers/alert.consumer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertEntity } from './entities/alert.entity';
import { AlertsGateway } from './gateways/alerts.gateway';
import { InboxModule } from '../inbox/inbox.module';
import { NewAirQualityAlertCommandHandler } from './command-handlers/new-air-quality-alert.command-handler';

@Module({
  imports: [TypeOrmModule.forFeature([AlertEntity]), InboxModule],
  providers: [AlertService, AlertsGateway, NewAirQualityAlertCommandHandler],
  controllers: [AlertController, AlertConsumer],
})
export class AlertModule {}
