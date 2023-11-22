/* eslint-disable prettier/prettier */
import { Appointment } from 'src/Appointment/appointment.entity';
import { Connection } from 'src/Connection/connection.entity';
import { DonationHistory } from 'src/Donation History/donation-history.entity';
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity('donors')
export class Donor {
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

  @ManyToOne(() => User, user => user.donor)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => DonationHistory, donationHistory => donationHistory.donor)
  donationHistory: DonationHistory[];

  @OneToMany(() => Appointment, appointment => appointment.donor)
  appointments: Appointment[];

  @OneToMany(() => Connection, connection => connection.donor)
  connections: Connection[];
  
}
