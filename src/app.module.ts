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
import { ConnectionModule } from './Connection/connection.module';
import { DonationHistoryModule } from './Donation History/donation-history.module';
import { AppointmentModule } from './Appointment/appointment.module';
import { RoomModule } from './Room/room.module';
import { DonationModule } from './Donation/donation.module';
// import { RolesGuard } from './auth/guard/role.guard';
// import { APP_GUARD } from '@nestjs/core';
// import { RolesGuard } from './auth/guard/role.guard';
// import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // TypeOrmModule.forRoot({
    //   type: process.env.DB_TYPE as any,
    //   host: process.env.PG_HOST,
    //   port: parseInt(process.env.PG_PORT),
    //   username: process.env.PG_USER,
    //   password: process.env.PG_PASSWORD,
    //   database: process.env.PG_DB,
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   synchronize: true,
    // }),
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
    ConnectionModule,
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
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ]
})
export class AppModule {}
