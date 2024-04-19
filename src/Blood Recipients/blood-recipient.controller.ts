/* eslint-disable prettier/prettier */
// blood-recipient.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, Patch, ParseIntPipe, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BloodRecipientService } from './blood-recipient.service';
import { BloodRecipient } from './blood-recipient.entity';
import { BloodRecipientImportService } from './blood-recipient-import.service';
import { FileInterceptor } from '@nestjs/platform-express';
// import { Roles } from 'src/auth/decorator/roles.decorator';
// import { Role } from 'src/role/enum/role.enum';
// import { RolesGuard } from 'src/auth/guard/role.guard';
import { ApiTags } from '@nestjs/swagger';
// import { LocalGuard } from 'src/auth/guard/local.guard';
// import { JwtGuard } from 'src/auth/guard/jwt.guard';

@ApiTags('blood-recipients')
@Controller('blood-recipients')
export class BloodRecipientController {
  constructor(
    private readonly bloodRecipientService: BloodRecipientService,
    private readonly bloodRecipientImportService: BloodRecipientImportService,
  ) {}

  // @Get()
  // findAll(): Promise<BloodRecipient[]> {
  //   return this.bloodRecipientService.findAll();
  // }

//   @Get()
//   // @Roles(Role.Admin)
//   // @UseGuards(JwtGuard, RolesGuard)
//   findAll(
//     @Query('page', ParseIntPipe) page: number = 1,
//     @Query('pageSize', ParseIntPipe) pageSize: number = 10,
//   ): Promise<BloodRecipient[]> {
//     return this.bloodRecipientService.findAll(page, pageSize);
//   }


  @Get(':id')
  // @Roles(Role.Admin)
  // @UseGuards(LocalGuard, RolesGuard)
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
