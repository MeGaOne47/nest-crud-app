/* eslint-disable prettier/prettier */
// donor.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonorController } from './donor.controller';
import { DonorService } from './donor.service';
import { Donor } from './donor.entity';
import { User } from 'src/users/user.entity';
import { DonationHistory } from 'src/Donation History/donation-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Donor, User, DonationHistory])],
  controllers: [DonorController],
  providers: [DonorService],
})
export class DonorModule {}
