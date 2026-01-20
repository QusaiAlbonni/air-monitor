import { Location } from "@air-monitor/air-quality/dto";

export interface Place {
  city: string;
  location: Location;
  countryCode: string;
}