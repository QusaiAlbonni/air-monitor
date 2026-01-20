import { Controller, Get, Query } from '@nestjs/common';
import { AlertService } from '../services/alert.service';
import { GetLatestDto } from '../dto/queries';
import { plainToInstance } from 'class-transformer';
import { AlertResponseDto } from '../dto/responses';

@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  async getLatest(@Query() query: GetLatestDto) {
    return plainToInstance(
      AlertResponseDto,
      await this.alertService.getLatest(query),
    );
  }
}
