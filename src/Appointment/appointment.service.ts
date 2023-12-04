/* eslint-disable prettier/prettier */
// appointment.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async create(appointment: Appointment): Promise<Appointment> {
    const createdAppointment = await this.appointmentRepository.save(appointment);
    this.sendReminderEmail(createdAppointment); // Gửi email nhắc nhở ngay sau khi tạo lịch hẹn
    return createdAppointment;
  }

  async findAll(): Promise<Appointment[]> {
    return await this.appointmentRepository.find();
  }

  async findOne(id: number): Promise<Appointment> {
    return await this.appointmentRepository.findOne({ where: { id } });
  }

  async update(id: number, appointment: Appointment): Promise<Appointment> {
    await this.appointmentRepository.update(id, appointment);
    return await this.appointmentRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.appointmentRepository.delete(id);
  }

    async sendReminderEmail(appointment: Appointment): Promise<void> {
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

      // Load thông tin liên quan từ bảng Donor và User
      const appointmentWithDetails = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.donor', 'donor')
        .leftJoinAndSelect('donor.user', 'user')
        .where('appointment.id = :id', { id: appointment.id })
        .getOne();

      // const recipientEmails = [appointmentWithDetails.donor.user.email];
      if (appointmentWithDetails && appointmentWithDetails.donor) {
        const recipientEmails = [appointmentWithDetails.donor.user.email];
      // Tùy chỉnh nội dung thư gửi
      const mailOptions = {
        from: 'nguyentanhung9a1@gmail.com',
        to: recipientEmails.join(', '),
        cc: recipientEmails.join(', '),
        bcc: recipientEmails.join(', '),
        subject: 'Nhắc nhở đặt hẹn hiến máu',
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

              .appointment-details {
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
              <img class="hutech-logo" src="https://media.loveitopcdn.com/3807/logo-hutech-1.png" alt="Logo HUTECH">
              <h1>Xin chào ${appointmentWithDetails.donor.user.username || 'Người hiến máu'},</h1>
              <p>
                Bạn có một cuộc hẹn hiến máu vào ngày ${appointmentWithDetails.appointmentDate} lúc ${appointmentWithDetails.appointmentTime}.
              </p>
              <div class="appointment-details">
                <p>
                  Hãy đến đúng giờ và chuẩn bị tâm thế tích cực cho hành động lành mạnh của mình!
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
          console.error('Error sending reminder email:', error);
        } else {
          console.log('Reminder email sent:', info.response);
        }
      });
    }

}
}