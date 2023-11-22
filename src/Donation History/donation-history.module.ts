/* eslint-disable prettier/prettier */
// donation-history.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationHistoryController } from './donation-history.controller';
import { DonationHistoryService } from './donation-history.service';
import { DonationHistory } from './donation-history.entity';
// import { DonorModule } from 'src/Donors/donor.module';

@Module({
  imports: [TypeOrmModule.forFeature([DonationHistory])],
  controllers: [DonationHistoryController],
  providers: [DonationHistoryService],
})
export class DonationHistoryModule {}
