import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  COLLECTOR_CLIENT_PROXY_TOKEN,
  getRabbitMQTransport,
  RABBITMQ_QUEUE_NAME,
} from './transport';
import { EventBus } from './events/event-bus';
import { ProxyEventBus } from './events/proxy-event-bus';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
ClientsModule.registerAsync([
  {
    name: COLLECTOR_CLIENT_PROXY_TOKEN,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      ...getRabbitMQTransport(configService),
    }),
  },
])
  ],
  providers: [MessagingService, { provide: EventBus, useClass: ProxyEventBus }],
  exports: [MessagingService, ClientsModule, EventBus],
})
export class MessagingModule {}
