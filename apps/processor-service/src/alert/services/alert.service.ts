import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlertEntity } from '../entities/alert.entity';
import { Repository } from 'typeorm';
import { AirQualityAlert } from '@air-monitor/air-quality/events/threshold-passed-alert.event';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(AlertEntity)
    private readonly repository: Repository<AlertEntity>,
  ) {}

  async save(alert: AirQualityAlert) {
    const entity = this.repository.create({
      city: alert.city,
      aqi: alert.indexes[0]!.aqi,
      category: alert.indexes[0]!.category,
      timestamp: new Date(alert.dateTime),
    });
    return await this.repository.save(entity);
  }

  async getLatest({ limit }: { limit?: number }) {
    return this.repository.find({
      take: limit ?? 20,
      order: { timestamp: 'DESC' },
    });
  }
}
