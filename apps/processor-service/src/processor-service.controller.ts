import { Controller, Get } from '@nestjs/common';
import { ProcessorServiceService } from './processor-service.service';

@Controller()
export class ProcessorServiceController {
  constructor(private readonly processorServiceService: ProcessorServiceService) {}

  @Get()
  getHello(): string {
    return this.processorServiceService.getHello();
  }
}
