/* eslint-disable prettier/prettier */
// connection.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { Connection } from './connection.entity';

@Controller('connections')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Get()
  findAll(): Promise<Connection[]> {
    return this.connectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Connection> {
    return this.connectionService.findOne(+id);
  }

  @Post()
  create(@Body() connection: Connection): Promise<Connection> {
    return this.connectionService.create(connection);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() connection: Connection): Promise<Connection> {
    return this.connectionService.update(+id, connection);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.connectionService.remove(+id);
  }

  @Post('quick-connect')
  async quickConnect(@Body() body: { donorId: number, recipientId: number }): Promise<Connection> {
    const { donorId, recipientId } = body;
    return await this.connectionService.findAndConnectDonorToRecipient(donorId, recipientId);
  }
}
