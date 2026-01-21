import { Module } from '@nestjs/common';
import { AlertService } from './services/alert.service';
import { AlertController } from './controllers/alert.controller';
import { AlertConsumer } from './consumers/alert.consumer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertEntity } from './entities/alert.entity';
import { AlertsGateway } from './gateways/alerts.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([AlertEntity])],
  providers: [AlertService, AlertsGateway],
  controllers: [AlertController, AlertConsumer],
})
export class AlertModule {}
