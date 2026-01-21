import { AirQualityReading } from "@air-monitor/air-quality/dto/air-quality-reading.interface";
import { AirQualityRule } from "./air-quality.rule";

export class AqiRule implements AirQualityRule {
  reason = 'AQI too high';

  isValid(reading: AirQualityReading): boolean {
    return reading.indexes[0].aqi <= 100;
  }
}
