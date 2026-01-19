import { Module } from '@nestjs/common';
import { ProcessorServiceController } from './processor-service.controller';
import { ProcessorServiceService } from './processor-service.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CoreModule } from '@air-monitor/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILE || '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    CoreModule
  ],
  controllers: [ProcessorServiceController],
  providers: [ProcessorServiceService],
})
export class ProcessorServiceModule {}
