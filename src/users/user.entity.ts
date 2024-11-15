/* eslint-disable prettier/prettier */
// import { BloodRecipient } from 'src/Blood Recipients/blood-recipient.entity';
import { Donor } from 'src/Donors/donor.entity';
import { Role } from 'src/role/enum/role.enum';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column({unique: true})
  email: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  profileImage: string; 

  @Column('simple-array', { nullable: true })
  roles: Role[];

  @Column({ nullable: true })
  refreshToken: string;

  @OneToOne(() => Donor, donor => donor.user, { cascade: true })
  @JoinColumn({ name: 'donor_id' })
  donor: Donor;

  // @OneToOne(() => BloodRecipient, { cascade: true })
  // @JoinColumn({ name: 'blood_recipient_id' })
  // bloodRecipient: BloodRecipient;

  @Column({ nullable: true }) 
  resetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiration: Date;

  @Column({ default: 0 })
  loginAttempts: number;

  @Column({ default: false }) // Tài khoản có bị khóa hay không
  isLocked: boolean;

}
