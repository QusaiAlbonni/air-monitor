import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import type { Location, Condition } from '../dto';
import { AirQualityService } from '../air-quality.service';
import { AxiosError } from 'axios';
import { InjectLogger } from '@air-monitor/core/logging';
import { Logger } from 'winston';

@Injectable()
export class GoogleAirQualityService implements AirQualityService {
  private apiKey: string;
  private readonly baseUrl = 'https://airquality.googleapis.com/v1';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.apiKey = this.configService.get<string>('GOOGLE_KEY')!;
  }

  async getCurrentCondition(location: Location): Promise<Condition> {
    const url = `${this.baseUrl}/currentConditions:lookup?key=${encodeURIComponent(this.apiKey)}`;

    const body = {
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      extraComputations: ['POLLUTANT_CONCENTRATION'],
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post<Condition>(url, body, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error found during api call: to ${this.baseUrl}, `, {
        location,
        error
      });
      throw new Error(
        `Error found during api call: to ${this.baseUrl}, error: ${error} `,
        error,
      );
    }
  }
}
