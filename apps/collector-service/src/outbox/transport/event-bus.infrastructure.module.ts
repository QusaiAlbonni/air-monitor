import { MessagingModule } from "@air-monitor/messaging";
import { Module } from "@nestjs/common";

@Module({
  imports: [MessagingModule],
  exports: [MessagingModule],
})
export class EventBusInfrastructureModule {}