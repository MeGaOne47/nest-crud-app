/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from './donation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Donation])], 
  controllers: [], 
  providers: [], 
})
export class DonationModule {} 
