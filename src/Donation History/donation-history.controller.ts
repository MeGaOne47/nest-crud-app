/* eslint-disable prettier/prettier */
// donation-history.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { DonationHistoryService } from './donation-history.service';
import { DonationHistory } from './donation-history.entity';
// import { Roles } from 'src/auth/decorator/roles.decorator';
// import { Role } from 'src/role/enum/role.enum';
// import { JwtGuard } from 'src/auth/guard/jwt.guard';
// import { RolesGuard } from 'src/auth/guard/role.guard';
import { ApiTags } from '@nestjs/swagger';
// import { AppointmentService } from 'src/Appointment/appointment.service';
// import { DonorService } from 'src/Donors/donor.service';

// @Roles(Role.Admin)
// @UseGuards(JwtGuard, RolesGuard)
@ApiTags('donation-history')
@Controller('donation-history')
export class DonationHistoryController {
  constructor(
    private readonly donationHistoryService: DonationHistoryService,
  ) {}

  @Get()
  findAll(): Promise<DonationHistory[]> {
    return this.donationHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<DonationHistory> {
    return this.donationHistoryService.findOne(+id);
  }

  @Post()
  create(@Body() donationHistory: DonationHistory): Promise<DonationHistory> {
    return this.donationHistoryService.create(donationHistory);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() donationHistory: DonationHistory): Promise<DonationHistory> {
    return this.donationHistoryService.update(+id, donationHistory);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.donationHistoryService.remove(+id);
  }

  // Thêm endpoint để lấy lịch sử hiến máu theo donor_id
  @Get('by-donor/:donorId')
  findByDonorId(@Param('donorId') donorId: string): Promise<DonationHistory[]> {
    return this.donationHistoryService.findByDonorId(+donorId);
  }

}
