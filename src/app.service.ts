import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Blog } from './interfaces/blog.interface';
import { InjectModel } from '@nestjs/mongoose';
import { FilterBlogsDto } from './dto/filters-blog.dto';

@Injectable()
export class AppService {
  constructor(@InjectModel('Blog') private blogModel: Model<Blog>) {}

  async findAll(filters: FilterBlogsDto): Promise<any> {
    // Applica i filtri
    const query = {};

    if (filters.search) {
      query['$or'] = [
        { titolo: { $regex: filters.search, $options: 'i' } },
        { descrizione: { $regex: filters.search, $options: 'i' } },
      ];
    }

    // Ottieni il conteggio totale
    const total = await this.blogModel.countDocuments(query);

    // Applica la paginazione
    const blogs = await this.blogModel
      .find(query)
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit)
      .sort({ createdAt: -1 });

    return {
      total: total,
      page: Number(filters.page),
      limit: Number(filters.limit),
      blogs: blogs,
    };
  }

  async create(createBlogDto: Blog): Promise<Blog> {
    // Creazione di un nuovo documento MongoDB
    const createdBlog = new this.blogModel(createBlogDto);
    // Salvataggio nel database
    return createdBlog.save();
  }

  async findByUser(filters: FilterBlogsDto): Promise<any> {
    // Applica i filtri
    const query = {};

    if( filters.user_id ) {
      query['user_id'] = filters.user_id;
    }

    if (filters.search) {
      query['$or'] = [
        { titolo: { $regex: filters.search, $options: 'i' } },
        { descrizione: { $regex: filters.search, $options: 'i' } },
      ];
    }

    // Ottieni il conteggio totale
    const total = await this.blogModel.countDocuments(query);

    // Applica la paginazione
    const blogs = await this.blogModel
      .find(query)
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit)
      .sort({ createdAt: -1 });

    return {
      total: total,
      page: Number(filters.page),
      limit: Number(filters.limit),
      blogs: blogs,
    };
  }
}
