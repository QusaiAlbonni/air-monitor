import { Module } from '@nestjs/common';
import { AirQualityService } from './air-quality.service';
import { GoogleAirQualityService } from './google/google-air-quality.service';
import { HttpModule } from '@nestjs/axios';
import { MockAirQualityService } from './mock/mock-air-quality.service';

@Module({
  imports: [HttpModule],
  providers: [{
    provide: AirQualityService,
    useClass: GoogleAirQualityService
  }],
  exports: [AirQualityService, AirQualityService],
})
export class AirQualityModule {}
