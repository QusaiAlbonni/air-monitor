import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ProcessorServiceModule } from './processor-service.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getRabbitMQTransport } from '@air-monitor/messaging';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ProcessorServiceModule);
  const configService = app.get(ConfigService)

  app.connectMicroservice<MicroserviceOptions>(getRabbitMQTransport(configService));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const config = new DocumentBuilder()
    .setTitle('Processor Service')
    .setDescription('API for processed air quality data')
    .setVersion('1.0')
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, config);
  if (process.env.NODE_ENV === 'development')
    SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  console.log('Processor microservice listener started');

  await app.listen(process.env.PORT || '3000');
  console.log(
    `Processor HTTP API running on http://localhost:${process.env.PORT}`,
  );
}

bootstrap();
