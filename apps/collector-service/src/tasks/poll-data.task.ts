import { Injectable } from '@nestjs/common';
import { Interval, Timeout } from '@nestjs/schedule';
import { CollectorService } from '../services/collector.service';
import { InjectLogger } from '@air-monitor/core/logging';
import { Logger } from 'winston';
import { PlaceService } from '../services/place.service';
import { AirQualityService } from '@air-monitor/air-quality';
import { AirQualityReading } from '@air-monitor/air-quality/dto/air-quality-reading.interface';

@Injectable()
export class PollAirQualityDataTask {
  constructor(
    private readonly collectorService: CollectorService,
    private readonly placeService: PlaceService,
    private readonly airQualityService: AirQualityService,
  ) {}

  //note: in a real system you may be polling for thousands of places, consider batching
  @Interval(10000)
  async pollData() {
    const places = this.placeService.findPlaces();
    const readings: AirQualityReading[] = (
      await Promise.allSettled(
        places.map(async (p) => {
          const cond = await this.airQualityService.getCurrentCondition(
            p.location,
          );
          return { ...cond, city: p.city };
        }),
      )
    )
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.value);
    await this.collectorService.collectAirQualityReadings(readings);
  }
}
