/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { Donation } from 'src/donation/donation.entity';
import { Donor } from 'src/Donors/donor.entity';
;

@Module({
  imports: [TypeOrmModule.forFeature([Room, Donation, Donor])],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
