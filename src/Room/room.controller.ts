/* eslint-disable prettier/prettier */
// room.controller.ts
import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './room.entity';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  getAllRooms(): Promise<Room[]> {
    return this.roomService.getRooms();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Room> {
    return this.roomService.findOne(+id);
  }

  @Post()
  createRoom(@Body() { name, maxParticipants, purpose, location, donationInstructions }: { name: string; maxParticipants: number, purpose: string, location: string, donationInstructions: string }) {
    return this.roomService.createRoom(name, maxParticipants, purpose, location, donationInstructions);
  }

  @Post(':roomId/join/:donorId')
  joinRoom(@Param('roomId') roomId: number, @Param('donorId') donorId: number) {
    return this.roomService.joinRoom(+roomId, +donorId);
  }

  @Post(':roomId/leave/:donorId')
  leaveRoom(@Param('roomId') roomId: number, @Param('donorId') donorId: number) {
    return this.roomService.leaveRoom(+roomId, +donorId);
  }

  @Put(':roomId')
  updateRoom(@Param('roomId') roomId: number, @Body() updateData: Partial<Room>) {
    return this.roomService.updateRoom(roomId, updateData);
  }

  @Delete(':roomId')
  deleteRoom(@Param('roomId') roomId: number) {
    return this.roomService.deleteRoom(roomId);
  }
  
}
