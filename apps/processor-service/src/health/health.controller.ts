// src/health/health.controller.ts
import { getRabbitMQTransport } from '@air-monitor/messaging';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private microServices: MicroserviceHealthIndicator,
    private configService: ConfigService,
    private typeorm: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 500 * 1024 * 1024),
      () =>
        this.microServices.pingCheck('rmq', {
          transport: Transport.RMQ,
          ...getRabbitMQTransport(this.configService),
        }),
      () => this.typeorm.pingCheck('database'),
    ]);
  }
}
