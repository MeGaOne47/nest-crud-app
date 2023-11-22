/* eslint-disable prettier/prettier */
import { Donor } from 'src/Donors/donor.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('donation_history')
export class DonationHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Donor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'donor_id' })
  donor: Donor;

  @Column()
  donationDate: Date;

  @Column()
  donatedAmount: number;

  @Column({ nullable: true })
  healthCheckResult: string;
  
}
