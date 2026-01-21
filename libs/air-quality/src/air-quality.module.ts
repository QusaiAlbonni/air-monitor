import { Module } from '@nestjs/common';
import { AirQualityService } from './air-quality.service';
import { GoogleAirQualityService } from './google/google-air-quality.service';
import { HttpModule } from '@nestjs/axios';
import { MockAirQualityService } from './mock/mock-air-quality.service';
import { ReadingValidator } from './validators/reading.validator';
import { RULES_LIST_TOKEN } from './validators/constants';
import { AqiRule } from './validators/rules/aqi.rule';
import { PollutantThresholdRule } from './validators/rules/pollutant.rule';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: AirQualityService,
      useClass: GoogleAirQualityService,
    },
    ReadingValidator,
    {
      provide: RULES_LIST_TOKEN,
      useValue: [new AqiRule(), new PollutantThresholdRule()],
    },
  ],
  exports: [AirQualityService, ReadingValidator, RULES_LIST_TOKEN],
})
export class AirQualityModule {}
