/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Donor } from 'src/Donors/donor.entity';
import { Room } from 'src/room/room.entity';



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
