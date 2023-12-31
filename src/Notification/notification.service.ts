/* eslint-disable prettier/prettier */
// notification.service.ts
import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  sendNotificationToUser(userId: string, message: string): void {
    this.notificationGateway.sendNotification(userId, message);
  }
}
