import { AirQualityAlert } from '@air-monitor/air-quality/events/threshold-passed-alert.event';
import { AirQualityAlertLoggingPayload } from '../interfaces/air-quality-alert.interface';
import { aqiColorToHex } from '@air-monitor/air-quality/util';

export function mapToAirQualityAlertPayload(
  raw: AirQualityAlert,
): AirQualityAlertLoggingPayload {
  const mainIndex = raw.indexes[0];

  const pollutants: Record<string, number> = {};
  raw.pollutants?.forEach((p) => {
    pollutants[p.code] = p.concentration.value;
  });

  const colorHex = mainIndex.color ? aqiColorToHex(mainIndex.color) : undefined;

  const payload: AirQualityAlertLoggingPayload = {
    city: raw.city,
    region: raw.regionCode,
    aqi: mainIndex.aqi,
    category: mainIndex.category,
    pollutants,
    dominantPollutant: mainIndex.dominantPollutant,
    color: colorHex,
    timestamp: raw.dateTime,
    source: 'air-quality-processor',
  };

  return payload;
}
