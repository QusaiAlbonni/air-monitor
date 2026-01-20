import { AirQualityAlert } from '@air-monitor/air-quality/events/threshold-passed-alert.event';
import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-alerts')
  handleJoinAlerts(@ConnectedSocket() client: Socket) {
    client.join('alerts');
    return { success: true };
  }

  onAlert(alert: AirQualityAlert) {
    this.server.emit('alert', alert);
  }
}
