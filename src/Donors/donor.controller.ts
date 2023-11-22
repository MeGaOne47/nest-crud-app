/* eslint-disable prettier/prettier */
// donor.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { DonorService } from './donor.service';
import { Donor } from './donor.entity';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { DisplayDonorDto } from './DTO/display-donor.dto';
import { DonationHistory } from 'src/Donation History/donation-history.entity';

@Controller('donors')
export class DonorController {
  constructor(private readonly donorService: DonorService) {}

  @Get()
  findAll(): Promise<Donor[]> {
    return this.donorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<DisplayDonorDto> {
    return this.donorService.findOne(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() donor: Donor, @Req() req): Promise<{ message: string }> {
    const userId = req.user.id;
    await this.donorService.create(donor, userId);
    return { message: 'Donor created successfully' };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() donor: Donor): Promise<Donor> {
    return this.donorService.update(+id, donor);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.donorService.remove(+id);
  }

  @Post(':id/record-donation')
  async recordDonation(@Param('id') donorId: string, @Body() donationHistory: DonationHistory): Promise<DonationHistory> {
    return this.donorService.recordDonation(+donorId, donationHistory);
  }
  
}
