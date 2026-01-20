import { Injectable } from '@nestjs/common';
import { AirQualityService } from '../air-quality.service';
import { InjectLogger } from '@air-monitor/core/logging';
import { Logger } from 'winston';
import type { Location } from '../dto';
import { Condition } from '../dto';

@Injectable()
export class MockAirQualityService implements AirQualityService {
  constructor(@InjectLogger() private readonly logger: Logger) {}

  async getCurrentCondition(location: Location): Promise<Condition> {
    this.logger.info(`Returning mock air quality data for location: ${JSON.stringify(location)}`);

    const mockCondition: Condition = {
      dateTime: new Date().toISOString(),
      regionCode: 'US-CA',
      indexes: [
        {
          code: 'AQI',
          displayName: 'Air Quality Index',
          aqi: 42,
          aqiDisplay: '42',
          color: { red: 0, green: 255, blue: 0, alpha: 1 },
          category: 'Good',
          dominantPollutant: 'pm25',
        },
      ],
      pollutants: [
        {
          code: 'pm25',
          displayName: 'Particulate Matter 2.5',
          concentration: {
            value: 199.3,
            units: 'µg/m³',
          },
        },
        {
          code: 'o3',
          displayName: 'Ozone',
          concentration: {
            value: 15.2,
            units: 'ppb',
          },
        },
      ],
    };

    return mockCondition;
  }
}
