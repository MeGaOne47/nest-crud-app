import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity'; // Thay thế User bằng Blog

@Injectable()
export class BlogsService {
  // Thay thế UserService bằng BlogsService
  constructor(
    @InjectRepository(Blog) // Thay thế User bằng Blog
    private blogRepository: Repository<Blog>, // Thay thế userRepository bằng blogRepository
  ) {}

  async findAll(): Promise<Blog[]> {
    return this.blogRepository.find();
  }

  async findOne(id: number): Promise<Blog> {
    return this.blogRepository.findOne({ where: { id } });
  }

  async create(blog: Partial<Blog>): Promise<Blog> {
    const newBlog = this.blogRepository.create(blog);
    return this.blogRepository.save(newBlog);
  }

  async update(id: number, blog: Partial<Blog>): Promise<Blog> {
    await this.blogRepository.update(id, blog);
    return this.blogRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.blogRepository.delete(id);
  }
}
