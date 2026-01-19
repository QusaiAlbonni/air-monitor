import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ProcessorServiceModule } from './processor-service.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getRabbitMQTransport } from '@air-monitor/messaging';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(ProcessorServiceModule);

  app.connectMicroservice<MicroserviceOptions>(getRabbitMQTransport());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const config = new DocumentBuilder()
    .setTitle('Processor Service')
    .setDescription('API for processed air quality data')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  console.log('Processor microservice listener started');

  await app.listen(process.env.PORT || '3000');
  console.log(`Processor HTTP API running on http://localhost:${process.env.PORT}` );
}

bootstrap();
