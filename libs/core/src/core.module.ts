import { Global, Module } from '@nestjs/common';
import { LoggingModule } from './logging/logging.module';

@Global()
@Module({
  imports: [LoggingModule],
  providers: [],
  exports: [LoggingModule],
})
export class CoreModule {}
