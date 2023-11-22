/* eslint-disable prettier/prettier */
// blood-recipient.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, Patch, ParseIntPipe, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BloodRecipientService } from './blood-recipient.service';
import { BloodRecipient } from './blood-recipient.entity';
import { BloodRecipientImportService } from './blood-recipient-import.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blood-recipients')
export class BloodRecipientController {
  constructor(
    private readonly bloodRecipientService: BloodRecipientService,
    private readonly bloodRecipientImportService: BloodRecipientImportService,
  ) {}

  @Get()
  findAll(): Promise<BloodRecipient[]> {
    return this.bloodRecipientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query('urgent') urgent: string): Promise<BloodRecipient> {
    return this.bloodRecipientService.findOne(id, urgent);
  }

  @Post()
  create(@Body() bloodRecipient: BloodRecipient): Promise<BloodRecipient> {
    return this.bloodRecipientService.create(bloodRecipient);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() bloodRecipient: BloodRecipient): Promise<BloodRecipient> {
    return this.bloodRecipientService.update(+id, bloodRecipient);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.bloodRecipientService.remove(+id);
  }

  @Patch(':id/set-urgent/:urgent')
  async setUrgent(@Param('id') id: string, @Param('urgent') urgent: string): Promise<BloodRecipient> {
    const bloodRecipient = await this.bloodRecipientService.setUrgent(+id, urgent);
    console.log("bloodRecipient2: ",bloodRecipient)
    if (!bloodRecipient) {
      // Xử lý Blood Recipient không tồn tại
      return null;
    }
    return bloodRecipient;
  }
  
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file: Express.Multer.File): Promise<void> {
    await this.bloodRecipientImportService.importFromExcel(file.buffer);
  }
}
