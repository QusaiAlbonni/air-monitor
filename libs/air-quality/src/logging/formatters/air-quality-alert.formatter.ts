import { format } from 'winston';
import { AirQualityAlertLoggingPayload } from '../interfaces/air-quality-alert.interface'

/**
 * Winston formatter for AirQuality alerts.
 * Logs only if `airQualityPayload` is present in the log info.
 */
export const airQualityAlertFormatter = format((info) => {
  const payload: AirQualityAlertLoggingPayload | undefined = info.airQualityPayload as AirQualityAlertLoggingPayload | undefined;
  if (!payload) return info;

  const pollutantsStr = Object.entries(payload.pollutants)
    .map(([code, value]) => `${code.toUpperCase()}: ${value ?? 'N/A'}`)
    .join(' | ');

  const colorHex = payload.color ?? '#FFFFFF';

  info.message = `
[ALERT] CRITICAL AIR QUALITY DETECTED
City: ${payload.city} | Region: ${payload.region}
AQI: ${payload.aqi} | Category: ${payload.category}
${pollutantsStr}
Dominant: ${payload.dominantPollutant ?? 'N/A'} | Color: ${colorHex}
`.trim();

  return info;
});
