/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller'; // Thay thế UserController bằng BlogsController
import { BlogsService } from './blogs.service'; // Thay thế UserService bằng BlogsService
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blog.entity'; // Thay thế User bằng Blog

@Module({
  imports: [TypeOrmModule.forFeature([Blog])], 
  controllers: [BlogsController], 
  providers: [BlogsService], 
})
export class BlogsModule {} 
