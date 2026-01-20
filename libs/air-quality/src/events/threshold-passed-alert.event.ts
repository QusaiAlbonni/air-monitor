import { Event } from '@air-monitor/messaging/events/decorator/event';
import { AirQualityReading } from '@air-monitor/air-quality/dto/air-quality-reading.interface';
import { AirQualityIndex } from '@air-monitor/air-quality/dto';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Pollutant } from '../dto/pollutant.interface';

@Event({ name: 'bad_air_alert' })
export class AirQualityAlert {
  @IsString()
  city: string;

  @IsString()
  dateTime: string;

  @IsString()
  regionCode: string;

  @ValidateNested({ each: true })
  @Type(() => AirQualityIndex)
  indexes: AirQualityIndex[];

  @ValidateNested({ each: true })
  @Type(() => Pollutant)
  pollutants: Pollutant[];

  constructor(reading?: AirQualityReading) {
    if (reading) {
      this.dateTime = reading.dateTime;
      this.regionCode = reading.regionCode;
      this.indexes = reading.indexes;
      this.city = reading.city;
      this.pollutants = reading.pollutants || [];
    }
  }
}
