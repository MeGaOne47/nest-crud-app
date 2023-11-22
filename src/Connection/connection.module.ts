/* eslint-disable prettier/prettier */
// connection.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionController } from './connection.controller';
import { ConnectionService } from './connection.service';
import { Connection } from './connection.entity';
import { Donor } from 'src/Donors/donor.entity';
import { BloodRecipient } from 'src/Blood Recipients/blood-recipient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Connection, Donor, BloodRecipient])],
  controllers: [ConnectionController],
  providers: [ConnectionService],
})
export class ConnectionModule {}
