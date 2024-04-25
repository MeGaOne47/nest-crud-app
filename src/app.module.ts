/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BlogsModule } from './blogs/blogs.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { DonorModule } from './Donors/donor.module';
import { BloodRecipientModule } from './Blood Recipients/blood-recipient.module';
import { DonationHistoryModule } from './Donation History/donation-history.module';
import { AppointmentModule } from './Appointment/appointment.module';
import { RoomModule } from './Room/room.module';
import { DonationModule } from './Donation/donation.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    
    BlogsModule,
    UsersModule,
    DonorModule,
    BloodRecipientModule,
    DonationHistoryModule,
    AppointmentModule,
    AuthModule,
    PassportModule.register({ session: true }),
    RoomModule,
    DonationModule, 
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ]
})
export class AppModule {}
