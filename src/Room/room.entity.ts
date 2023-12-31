/* eslint-disable prettier/prettier */
// room.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import { Donation } from '../donation/donation.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  maxParticipants: number;

  @Column({ default: 0 })
  participantsCount: number;

  @Column({ nullable: true })
  purpose: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  donationInstructions: string;

  @OneToMany(() => Donation, donation => donation.room)
  @JoinColumn({ name: 'donation_id' })
  donations: Donation[];
}
