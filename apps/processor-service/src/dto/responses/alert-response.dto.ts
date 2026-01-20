import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AlertResponseDto {
  @Expose()
  city: string;

  @Expose()
  aqi: number;

  @Expose()
  category: string;

  @Expose()
  timestamp: Date;
}
