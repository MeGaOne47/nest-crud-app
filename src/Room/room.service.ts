/* eslint-disable prettier/prettier */

// room.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { Donation } from 'src/donation/donation.entity';
import { Donor } from 'src/Donors/donor.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
    @InjectRepository(Donor)
    private readonly donorRepository: Repository<Donor>,
  ) {}

  async findOne(id: number): Promise<Room> {
    return await this.roomRepository.findOne({ where: { id } });
  }

  async createRoom(name: string, maxParticipants: number, purpose: string, location: string, donationInstructions: string): Promise<Room> {
    const room = this.roomRepository.create({ name, maxParticipants, purpose, location, donationInstructions });
    return await this.roomRepository.save(room);
  }

  async getRooms(): Promise<Room[]> {
    return await this.roomRepository.find();
  }

  async joinRoom(roomId: number, donorId: number): Promise<void> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });

    console.log("room",room)
    if (!room) {
      throw new Error('Room not found');
    }

    // if (room.donations.length >= room.maxParticipants) {
    //   throw new Error('Room is full');
    // }

    const donor = await this.donorRepository
      .createQueryBuilder('donor')
      .leftJoinAndSelect('donor.user', 'user') // Include the user relation
      .where('donor.id = :id', { id: donorId })
      .getOne();
      console.log("donor",donor)

    if (!donor || !donor.user || !donor.user.email) {
      throw new Error('Donor or user email is missing');
    }

    // Kiểm tra xem người dùng đã tham gia phòng chưa
    const existingDonation = await this.donationRepository.findOne({
      where: { room: { id: roomId }, donor: { id: donorId } },
    });

    if (existingDonation) {
      throw new NotFoundException('Donor already joined the room');
    }

    const donation = this.donationRepository.create({
      room: room,
      donor: { id: donorId },
    });
    console.log("donation",donation)
    await this.donationRepository.save(donation);

    room.participantsCount += 1;
    await this.roomRepository.save(room);

    this.sendNotificationEmail(donor.user.email, room);
  }

  async leaveRoom(roomId: number, donorId: number): Promise<void> {
    const room = await this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.donations', 'donations')
      .where('room.id = :id', { id: roomId })
      .getOne();

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Find the donation associated with the donor and room
    const donation = await this.donationRepository.findOne({
      where: { room: { id: roomId }, donor: { id: donorId } },
    });

    if (!donation) {
      throw new NotFoundException('Donation not found');
    }

    // Remove the donation from the database
    await this.donationRepository.remove(donation);

    // Decrement the number of participants in the room
    room.participantsCount -= 1;
    await this.roomRepository.save(room);
  }

  private sendNotificationEmail(recipientEmail: string, room: Room): void {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'nguyentanhung9a1@gmail.com',
        pass: 'ssonbvlpulaehfxp',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: '"Đại Học Công Nghệ TP.HCM" <nguyentanhung9a1@gmail.com>',
      to: recipientEmail,
      subject: 'Thông báo tham gia Room hiến máu',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f7f7f7;
            }

            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 15px;
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            }

            h1 {
              color: #3498db;
              text-align: center;
            }

            p {
              color: #555555;
              line-height: 1.6;
            }

            .room-details {
              margin-top: 20px;
              background-color: #ecf0f1;
              padding: 15px;
              border-radius: 10px;
            }

            .thank-you {
              margin-top: 20px;
              text-align: center;
              color: #2ecc71;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p>
              Bạn đã tham gia vào Room hiến máu "${room.name}".
            </p>
            <div class="room-details">
              <p>
                <strong>Mục đích:</strong> ${room.purpose || 'Không có thông tin'}
              </p>
              <p>
                <strong>Địa điểm:</strong> ${room.location || 'Không có thông tin'}
              </p>
              <p>
                <strong>Hướng dẫn hiến máu:</strong> ${room.donationInstructions || 'Không có thông tin'}
              </p>
            </div>
            <p class="thank-you">Chân thành cảm ơn,</p>
            <p class="thank-you">Ứng dụng Quản lý Hiến Máu</p>
          </div>
        </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending notification email:', error);
      } else {
        console.log('Notification email sent:', info.response);
      }
    });
  }

  async updateRoom(roomId: number, updateData: Partial<Room>): Promise<Room> {
    const room = await this.roomRepository.findOne({where:{id: roomId}});

    if (!room) {
      throw new Error('Room not found');
    }

    Object.assign(room, updateData);

    return await this.roomRepository.save(room);
  }

  async deleteRoom(roomId: number): Promise<void> {
    const room = await this.roomRepository.findOne({where:{id: roomId}});

    if (!room) {
      throw new Error('Room not found');
    }

    await this.roomRepository.remove(room);
  }
}