/* eslint-disable prettier/prettier */
// donor.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donor } from './donor.entity';
import { User } from 'src/users/user.entity';
import { DisplayDonorDto } from './DTO/display-donor.dto';
import { plainToClass } from 'class-transformer';
import { DonationHistory } from 'src/Donation History/donation-history.entity';

@Injectable()
export class DonorService {
  constructor(
    @InjectRepository(Donor)
    private readonly donorRepository: Repository<Donor>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DonationHistory)
    private readonly donationHistoryRepository: Repository<DonationHistory>,
  ) {}

  async create(donor: Donor, userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      // Xử lý trường hợp không tìm thấy người dùng
      throw new Error('User not found');
    }

    donor.user = user;
    await this.donorRepository.save(donor);

    // Cập nhật donor_id trong User
    user.donor = donor;
    await this.userRepository.save(user);
  }

  async findAll(): Promise<Donor[]> {
    return await this.donorRepository.find();
  }

  async findOne(id: number): Promise<DisplayDonorDto> {
    console.log(`Finding donor with id ${id}`);

    const donor = await this.donorRepository.findOne({ where: { id }, relations: ['user'], });

    if (!donor) {
      console.log(`Donor with id ${id} not found`);
      return null; 
    }

    const displayDonorDto: DisplayDonorDto = plainToClass(DisplayDonorDto, donor);

    console.log('Found donor:', displayDonorDto);

    return displayDonorDto;
  }

  async update(id: number, donor: Donor): Promise<Donor> {
    await this.donorRepository.update(id, donor);
    return await this.donorRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.donorRepository.delete(id);
  }

  async recordDonation(donorId: number, donationHistory: DonationHistory): Promise<DonationHistory> {
    const donor = await this.donorRepository.findOne({ where: { id: donorId } });
    if (!donor) {
      // Xử lý donor không tồn tại
      return null;
    }

    donationHistory.donor = donor;
    return await this.donationHistoryRepository.save(donationHistory);
  }

}
