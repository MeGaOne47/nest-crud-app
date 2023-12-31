/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, UseGuards, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/role/enum/role.enum';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { ApiTags } from '@nestjs/swagger';
import { LocalGuard } from 'src/auth/guard/local.guard';
import { Response } from 'express';
import * as fs from 'fs';
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  //get all users

  // @UseGuards(JwtGuard)
  @Get()
  // @Roles(Role.Admin)
  // @UseGuards(RolesGuard)
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  //get user by id
  @Get(':id')
  // @Roles(Role.Admin)
  // @UseGuards(JwtGuard, RolesGuard)
  async findOne(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    } else {
      return user;
    }
  }

  //create user
  @Post()
  // @Roles(Role.Admin)
  async create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  //update user
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
}


  //delete user
  @Delete(':id')
  // @UseGuards(JwtGuard)
  async delete(@Param('id') id: number): Promise<any> {
    //handle error if user does not exist
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return this.usersService.delete(id);
  }

  @Post(':id/profile-image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        const fileName = `${randomName}${extname(file.originalname)}`;
        file['customName'] = fileName; // Thêm tên tệp vào thuộc tính 'customName'
        callback(null, fileName);
      },
    }),
  }))
  async uploadProfileImage(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    const user = await this.usersService.findOne(id);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Lấy đường dẫn ảnh cũ (nếu có)
    const oldImagePath = user.profileImage;
  
    // Lưu đường dẫn mới vào cơ sở dữ liệu
    user.profileImage = file['customName']; // Sử dụng 'customName' thay vì 'path'
    await this.usersService.updateUserProfileImage(id, user.profileImage);
  
    // Xóa ảnh cũ nếu có
    if (oldImagePath) {
      try {
        fs.unlinkSync(`./uploads/${oldImagePath}`);
      } catch (error) {
        console.error(`Error deleting old image: ${error.message}`);
      }
    }
  
    return { message: 'Image uploaded successfully' };
  }
  

  
  @Get(':id/profile-image')
  async getUserProfileImage(@Param('id') id: number, @Res() res: Response) {
    const user = await this.usersService.findOne(id);
    if (!user || !user.profileImage) {
      throw new NotFoundException('Profile image not found');
    }

    // Trả về hình ảnh
    res.sendFile(user.profileImage, { root: 'uploads' });
  }
}
