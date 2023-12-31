/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/role/enum/role.enum';

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
    const newUser = this.userRepository.create({ roles: [Role.User], ...user });
    
    return this.userRepository.save(newUser);
  }

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

    if (updateUserDto.roles) {
      user.roles = updateUserDto.roles;
    }

    if (updateUserDto.isLocked !== undefined) {
      user.isLocked = updateUserDto.isLocked;
    }
  
    return this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getUserSTT(id: number): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user ? user.id : null;
  }

  async updateUserProfileImage(id: number, imagePath: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.profileImage = imagePath;
    return this.userRepository.save(user);
  }

}
