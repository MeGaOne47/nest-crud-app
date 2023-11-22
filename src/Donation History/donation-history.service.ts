/* eslint-disable prettier/prettier */
// donation-history.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DonationHistory } from './donation-history.entity';
// import { Donor } from 'src/Donors/donor.entity';

@Injectable()
export class DonationHistoryService {
  constructor(
    @InjectRepository(DonationHistory)
    private readonly donationHistoryRepository: Repository<DonationHistory>,
  ) {}

  async create(donationHistory: DonationHistory): Promise<DonationHistory> {
    return await this.donationHistoryRepository.save(donationHistory);
  }

  async findAll(): Promise<DonationHistory[]> {
    return await this.donationHistoryRepository.find();
  }

  async findOne(id: number): Promise<DonationHistory> {
    return await this.donationHistoryRepository.findOne({ where: { id } });
  }

  async update(id: number, donationHistory: DonationHistory): Promise<DonationHistory> {
    await this.donationHistoryRepository.update(id, donationHistory);
    return await this.donationHistoryRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.donationHistoryRepository.delete(id);
  }

}
