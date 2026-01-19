import { Global, Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { LoggingModule } from './logging/logging.module';

@Global()
@Module({
  imports: [LoggingModule],
  providers: [CoreService],
  exports: [CoreService, LoggingModule],
})
export class CoreModule {}
