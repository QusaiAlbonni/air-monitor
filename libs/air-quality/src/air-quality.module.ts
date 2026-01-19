import { Module } from '@nestjs/common';
import { AirQualityService } from './air-quality.service';

@Module({
  providers: [AirQualityService],
  exports: [AirQualityService],
})
export class AirQualityModule {}
