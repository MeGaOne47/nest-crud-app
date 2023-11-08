/* eslint-disable prettier/prettier */
// import { Type } from 'class-transformer';
// import { IsEmail, Length } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // username: string;

  @Column()
  // @Length(8, 20, { message: 'Mật khẩu phải có độ dài từ 8 đến 20 ký tự.' })
  password: string;

  @Column()
  // @IsEmail({}, { message: 'Email không hợp lệ.' })
  @Column({unique: true})
  email: string;

  @Column({ nullable: true })
  username: string;

  // @Column({ nullable: true })
  // @IsIn(['A', 'B', 'AB', 'O'], { message: 'Nhóm máu không hợp lệ.' })
  // blood_type: string;

  // @Type(() => Date)
  // @Column('text', { nullable: true })
  // @IsDate({ message: 'Ngày hiến máu không hợp lệ.' })
  // last_donation_date: Date;
  // eslint-disable-next-line prettier/prettier
}
