import { Injectable } from '@nestjs/common';
import { Condition, Location } from './dto';

export abstract class AirQualityService {
  abstract getCurrentCondition(location: Location): Promise<Condition>;
}
