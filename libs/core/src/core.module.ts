import { Global, Module } from '@nestjs/common';
import { LoggingModule } from './logging/logging.module';
import { MessagingModule } from '@air-monitor/messaging';
import { HealthModule } from 'apps/processor-service/src/health/health.module';

@Global()
@Module({
  imports: [LoggingModule, MessagingModule],
  providers: [],
  exports: [LoggingModule, MessagingModule],
})
export class CoreModule {}
