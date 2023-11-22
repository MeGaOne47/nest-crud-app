/* eslint-disable prettier/prettier */
// connection.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connection } from './connection.entity';
import { Donor } from 'src/Donors/donor.entity';
import { BloodRecipient } from 'src/Blood Recipients/blood-recipient.entity';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
    @InjectRepository(Donor)
    private readonly donorRepository: Repository<Donor>,
    @InjectRepository(BloodRecipient)
    private readonly bloodRecipientRepository: Repository<BloodRecipient>,
  ) {}

  async create(connection: Connection): Promise<Connection> {
    return await this.connectionRepository.save(connection);
  }

  async findAll(): Promise<Connection[]> {
    return await this.connectionRepository.find();
  }

  async findOne(id: number): Promise<Connection> {
    return await this.connectionRepository.findOne({ where: { id } });
  }

  async update(id: number, connection: Connection): Promise<Connection> {
    await this.connectionRepository.update(id, connection);
    return await this.connectionRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.connectionRepository.delete(id);
  }

  async findAndConnectDonorToRecipient(donorId: number, recipientId: number): Promise<Connection> {
    const donor = await this.donorRepository.findOne({ where: { id: donorId } });
    const recipient = await this.bloodRecipientRepository.findOne({ where: { id: recipientId } });

    if (!donor || !recipient) {
      // Xử lý donor hoặc recipient không tồn tại
      return null;
    }

    // Thực hiện kiểm tra và logic phù hợp khác để xác định liệu donor và recipient có thể được kết nối hay không

    const connection: Connection = {
      id: undefined,
      donor,
      bloodRecipient: recipient,
      connectionDate: new Date(),
      status: 'Đã Kết Nối',
    };

    return await this.connectionRepository.save(connection);
  }
  
}
