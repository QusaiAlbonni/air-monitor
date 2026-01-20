import { IsNumber, IsOptional } from "class-validator";

export class AQIColor {
  @IsNumber()
  @IsOptional()
  red?: number;

  @IsNumber()
  @IsOptional()
  green?: number;

  @IsNumber()
  @IsOptional()
  blue?: number;

  @IsNumber()
  @IsOptional()
  alpha?: number;
}
