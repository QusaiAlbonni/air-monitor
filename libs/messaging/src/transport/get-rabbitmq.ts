import { RmqOptions, Transport } from "@nestjs/microservices";

export function getRabbitMQTransport(): RmqOptions{
  return {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ || 'amqp://localhost:5672'],
      queue: 'air-quality-queue',
      queueOptions: { durable: true },
    },
  };
}