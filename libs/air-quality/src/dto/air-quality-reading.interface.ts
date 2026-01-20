import { Condition } from '@air-monitor/air-quality/dto';

export type AirQualityReading = Condition & { city: string };