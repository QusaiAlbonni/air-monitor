import { CoreModule } from '@air-monitor/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILE || '.env',
      isGlobal: true,
    }),
    CoreModule
  ],
  controllers: [],
  providers: [],
})
export class CollectorServiceModule {}
