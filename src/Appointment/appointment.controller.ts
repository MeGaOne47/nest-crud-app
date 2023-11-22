/* eslint-disable prettier/prettier */
// appointment.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.entity';
// import { DonorService } from 'src/Donors/donor.service';

@Controller('appointments')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
  ) {}

  @Get()
  findAll(): Promise<Appointment[]> {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentService.findOne(+id);
  }

  @Post()
  create(@Body() appointment: Appointment): Promise<Appointment> {
    return this.appointmentService.create(appointment);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() appointment: Appointment): Promise<Appointment> {
    return this.appointmentService.update(+id, appointment);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.appointmentService.remove(+id);
  }

}
