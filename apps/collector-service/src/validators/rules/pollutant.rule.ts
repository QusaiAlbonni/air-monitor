import { AirQualityReading } from '@air-monitor/air-quality/dto/air-quality-reading.interface';
import { AirQualityRule } from './air-quality.rule';
import { LIMITS, pollutantsToCheck } from '../constants';

export class PollutantThresholdRule implements AirQualityRule {
  reason = 'Max Pollutant threshold passed';
  isValid(reading: AirQualityReading): boolean {
    return (
      reading.pollutants
        ?.filter((p) => pollutantsToCheck.includes(p.code))
        .every((p) => {
          const limit = LIMITS[p.code];
          return limit ? p.concentration.value <= limit : true;
        }) ?? true
    );
  }
}
