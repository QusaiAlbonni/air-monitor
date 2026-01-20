export interface AirQualityAlertLoggingPayload {
  city: string;
  region: string;
  aqi: number;
  category: string;
  pollutants: {
    pm25?: number;
    pm10?: number;
    [pollutantCode: string]: number | undefined;
  };
  dominantPollutant?: string;
  color?: string;
  timestamp?: string;
  source?: string;
}
