/* eslint-disable prettier/prettier */
import { Donor } from 'src/Donors/donor.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Donor, donor => donor.appointments)
  @JoinColumn({ name: 'donor_id' })
  donor: Donor;
  
  @Column()
  appointmentDate: Date;
  
  @Column()
  appointmentTime: string;

  @Column()
  status: string;

}
