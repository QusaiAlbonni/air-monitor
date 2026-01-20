import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, Max } from 'class-validator';

export class GetLatestDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  @Type(() => Number)
  limit?: number;
}
