import { IsNumber, IsString, ValidateNested } from "class-validator";
import { AQIColor } from "./color.interface";
import { Type } from "class-transformer";

export class AirQualityIndex {
  @IsString()
  code: string;

  @IsString()
  displayName: string;
  
  @IsNumber()
  aqi: number;

  @IsString()
  aqiDisplay: string;

  @ValidateNested()
  @Type(() => AQIColor)
  color: AQIColor;

  @IsString()
  category: string;

  @IsString()
  dominantPollutant: string;
}