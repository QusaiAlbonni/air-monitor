import { Type } from 'class-transformer';
import { IsNumber, IsString, Validate, ValidateNested } from 'class-validator';

export class Concentration {
  @IsNumber()
  value: number;

  @IsString()
  units: string;
}


export class Pollutant {
  @IsString()
  code: string;

  @IsString()
  displayName: string;

  @ValidateNested()
  @Type(() => Concentration)
  concentration: Concentration;
}

