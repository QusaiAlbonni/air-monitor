import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { CollectorServiceModule } from './collector-service.module';
import { getRabbitMQTransport } from '@air-monitor/messaging';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(CollectorServiceModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.startAllMicroservices();
  console.log('Collector microservice ready to send events to RabbitMQ');

  await app.listen(process.env.PORT || '3001');
  console.log(`Collector HTTP API running on http://localhost:${process.env.PORT}` );
}
bootstrap();
