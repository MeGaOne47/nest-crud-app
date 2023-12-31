/* eslint-disable prettier/prettier */
// notification.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  sendNotification(@Body() { userId, message }: { userId: string, message: string }): void {
    this.notificationService.sendNotificationToUser(userId, message);
  }
}
