import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { Blog } from './interfaces/blog.interface';
import { FilterBlogsDto } from './dto/filters-blog.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('blogService.ping')
  handlePing() {
    return { status: 'ok' };
  }

  @MessagePattern({ service: 'blog-service', cmd: 'create-blog' })
  async createBlog(createBlogDto: Blog): Promise<Blog> {
    return this.appService.create(createBlogDto);
  }

  @MessagePattern({ service: 'blog-service', cmd: 'get-all-blogs' })
  getAllBlogs(data: FilterBlogsDto) {
    return this.appService.findAll({
      page: data.page,
      limit: data.limit,
      search: data.search,
    });
  }

  @MessagePattern({ service: 'blog-service', cmd: 'get-user-blogs' })
  getBlogsUser(data: FilterBlogsDto) {
    return this.appService.findByUser(data);
  }
}
