/* eslint-disable prettier/prettier */
// blood-recipient.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloodRecipientController } from './blood-recipient.controller';
import { BloodRecipientService } from './blood-recipient.service';
import { BloodRecipient } from './blood-recipient.entity';
import { BloodRecipientImportService } from './blood-recipient-import.service';

@Module({
  imports: [TypeOrmModule.forFeature([BloodRecipient])],
  controllers: [BloodRecipientController],
  providers: [BloodRecipientService, BloodRecipientImportService],
})
export class BloodRecipientModule {}
