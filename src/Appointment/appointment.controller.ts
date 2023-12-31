/* eslint-disable prettier/prettier */
// appointment.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.entity';
import { ApiTags } from '@nestjs/swagger';
// import { Roles } from 'src/auth/decorator/roles.decorator';

// import { JwtGuard } from 'src/auth/guard/jwt.guard';
// import { RolesGuard } from 'src/auth/guard/role.guard';
// import { Role } from 'src/role/enum/role.enum';
// import { DonorService } from 'src/Donors/donor.service';

// @Roles(Role.Admin)
// @UseGuards( RolesGuard)
@ApiTags('appointments')
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
  // @Roles(Role.Admin)
  // @UseGuards(JwtGuard, RolesGuard)
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
