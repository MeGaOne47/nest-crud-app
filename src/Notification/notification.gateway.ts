/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket): void {
    // Logic khi có kết nối
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    // Logic khi mất kết nối
    console.log(`Client disconnected: ${client.id}`);
  }

  sendNotification(userId: string, message: string): void {
    this.server.to(userId).emit('notification', message);
  }

  @SubscribeMessage('customEvent')
  handleCustomEvent(client: Socket, payload: any): void {
    // Logic xử lý sự kiện tùy chỉnh từ client
    console.log(`Received custom event from client ${client.id}: ${payload}`);
  }
}

