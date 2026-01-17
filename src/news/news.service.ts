import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { News } from './schemas/news.schema';
import { Model } from 'mongoose';
import { CreateNewsDto } from './dto/create-news.dto';
import slugify from 'slugify';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name)
    private readonly newsModel: Model<News>,
  ) {}

  // Create News
  async create(
    createNewsDto: CreateNewsDto,
    imageUrl: string,
    imagePublicId?: string,
  ) {
    const slug = slugify(createNewsDto.title, { lower: true });

    const existingNews = await this.newsModel.findOne({ slug });

    if (existingNews) {
      throw new ConflictException('News with this title already exists');
    }

    return this.newsModel.create({
      ...createNewsDto,
      slug,
      imageUrl,
      imagePublicId,
    });
  }

  // Get all news
  getAll() {
    return this.newsModel.find().exec();
  }
}
