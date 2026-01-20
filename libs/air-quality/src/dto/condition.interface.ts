import { AirQualityIndex } from "./index.interface";
import { Pollutant } from "./pollutant.interface";

export class Condition {
  dateTime: string;
  regionCode: string;
  indexes: AirQualityIndex[];
  pollutants?: Pollutant[];
}