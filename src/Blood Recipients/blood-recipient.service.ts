/* eslint-disable prettier/prettier */
// blood-recipient.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BloodRecipient } from './blood-recipient.entity';

@Injectable()
export class BloodRecipientService {
  constructor(
    @InjectRepository(BloodRecipient)
    private readonly bloodRecipientRepository: Repository<BloodRecipient>,
  ) {}

  async create(bloodRecipient: BloodRecipient): Promise<BloodRecipient> {
    return await this.bloodRecipientRepository.save(bloodRecipient);
  }

//   async findAll(urgent?: string): Promise<BloodRecipient[]> {
//     const queryBuilder: SelectQueryBuilder<BloodRecipient> = this.bloodRecipientRepository.createQueryBuilder('bloodRecipient');

//     if (urgent !== undefined) {
//       queryBuilder.andWhere('bloodRecipient.urgent = :urgent', { urgent });
//     }

//     return await queryBuilder.getMany();
//   }


  async findOne(id: number, urgent?: string): Promise<BloodRecipient> {
    const queryBuilder: SelectQueryBuilder<BloodRecipient> = this.bloodRecipientRepository.createQueryBuilder('bloodRecipient');

    queryBuilder.where('bloodRecipient.id = :id', { id });

    if (urgent !== undefined) {
      queryBuilder.andWhere('bloodRecipient.urgent = :urgent', { urgent });
    }

    return await queryBuilder.getOne();
  }

  async update(id: number, bloodRecipient: BloodRecipient): Promise<BloodRecipient> {
    await this.bloodRecipientRepository.update(id, bloodRecipient);
    return await this.bloodRecipientRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.bloodRecipientRepository.delete(id);
  }

  async setUrgent(id: number, urgent: string): Promise<BloodRecipient> {
    const bloodRecipient = await this.bloodRecipientRepository.findOne({ where: { id } });
    if (!bloodRecipient) {
      return null;
    }

    bloodRecipient.urgent = urgent;
    console.log("bloodRecipient1: ",bloodRecipient)
    console.log("urgent: ",urgent)

    return await this.bloodRecipientRepository.save(bloodRecipient);
  }
  
  async createMultiple(bloodRecipients: BloodRecipient[]): Promise<BloodRecipient[]> {
    return await this.bloodRecipientRepository.save(bloodRecipients);
  }
}
