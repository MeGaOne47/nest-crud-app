/* eslint-disable prettier/prettier */
import { BloodRecipient } from 'src/Blood Recipients/blood-recipient.entity';
import { Donor } from 'src/Donors/donor.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('connections')
export class Connection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Donor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'donor_id' })
  donor: Donor;

  @ManyToOne(() => BloodRecipient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blood_recipient_id' })
  bloodRecipient: BloodRecipient;

  @Column()
  connectionDate: Date;

  @Column()
  status: string;
}
