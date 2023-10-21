import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { BlogsService } from './blogs.service'; // Thay thế UsersService bằng BlogsService
import { Blog } from './blog.entity'; // Thay thế User bằng Blog

@Controller('blogs') // Thay thế 'users' bằng 'blogs'
export class BlogsController {
  // Thay đổi tên của UsersController thành BlogsController
  constructor(private readonly blogsService: BlogsService) {}

  // Lấy tất cả blogs
  @Get()
  async findAll(): Promise<Blog[]> {
    return this.blogsService.findAll();
  }

  // Lấy blog theo ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Blog> {
    const blog = await this.blogsService.findOne(id);
    if (!blog) {
      throw new NotFoundException('Blog does not exist!');
    } else {
      return blog;
    }
  }

  // Tạo blog mới
  @Post()
  async create(@Body() blog: Blog): Promise<Blog> {
    return this.blogsService.create(blog);
  }

  // Cập nhật blog
  @Put(':id')
  async update(@Param('id') id: number, @Body() blog: Blog): Promise<any> {
    return this.blogsService.update(id, blog);
  }

  // Xóa blog
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    // Xử lý lỗi nếu blog không tồn tại
    const blog = await this.blogsService.findOne(id);
    if (!blog) {
      throw new NotFoundException('Blog does not exist!');
    }
    return this.blogsService.delete(id);
  }
}
