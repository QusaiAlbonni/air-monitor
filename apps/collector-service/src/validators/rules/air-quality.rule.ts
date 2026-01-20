import { AirQualityReading } from "@air-monitor/air-quality/dto/air-quality-reading.interface";

export interface AirQualityRule {
  isValid(reading: AirQualityReading): boolean;
  reason?: string;
}
