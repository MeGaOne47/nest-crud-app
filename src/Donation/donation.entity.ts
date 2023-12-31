/* eslint-disable prettier/prettier */
// donation.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from '../room/room.entity';
import { Donor } from 'src/Donors/donor.entity';


@Entity('donations')
export class Donation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, room => room.donations)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => Donor, donor => donor.donations)
  @JoinColumn({ name: 'donor_id' })
  donor: Donor;
}
