import { ConfigService } from "@nestjs/config";
import { RmqOptions, Transport } from "@nestjs/microservices";

export function getRabbitMQTransport(configService: ConfigService): RmqOptions {
  const queueName = configService.get<string>('QUEUE_NAME');
  return {
    transport: Transport.RMQ,
    options: {
      noAck: true,
      urls: [process.env.RABBITMQ!],
      queue: queueName,
      queueOptions: { durable: true },
    },
  };
}