/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  // async update(id: number, user: Partial<User>): Promise<User | null> {
  //   const existingUser = await this.userRepository.findOne({ where: { id } });

  //   // Lưu thông tin cập nhật
  //   return this.userRepository.save(existingUser);
  // }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }
  
    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }
  
    return this.userRepository.save(user);
  }
  

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  // Lấy trường 'id' của một bản ghi
  async getUserSTT(id: number): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user ? user.id : null;
  }
}
