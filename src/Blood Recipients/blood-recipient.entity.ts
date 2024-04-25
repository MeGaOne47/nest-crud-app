/* eslint-disable prettier/prettier */
import { Appointment } from 'src/Appointment/appointment.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('blood_recipients')
export class BloodRecipient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  birthDate: Date;

  @Column()
  gender: string;

  @Column()
  address: string;

  @Column()
  phoneNumber: string;

  @Column()
  bloodType: string;

  @Column()
  rhFactor: string;

  @Column()
  requiredAmount: number;

  @OneToMany(() => Appointment, appointment => appointment.donor)
  appointments: Appointment[];

  @Column({ default: false })
  urgent: string;
  
}
