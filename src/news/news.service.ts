import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { News } from './schemas/news.schema';
import { Model } from 'mongoose';
import { CreateNewsDto } from './dto/create-news.dto';
import slugify from 'slugify';
import { UpdateNewsDto } from './dto/update-news.dto';

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

    return {
      statusCode: HttpStatus.CREATED,
      message: 'News created successfully',
      data: await this.newsModel.create({
        ...createNewsDto,
        slug,
        imageUrl,
        imagePublicId,
      }),
    };
  }

  // Get all news
  async getAll() {
    return {
      statusCode: HttpStatus.OK,
      message: 'News fetched successfully',
      data: await this.newsModel.find().exec(),
    };
  }

  // Update news
  async updateNews(
    id: string,
    updateNewsDto: UpdateNewsDto,
    imageUrl?: string,
    imagePublicId?: string,
  ) {
    const news = await this.newsModel.findById(id);
    if (!news) throw new NotFoundException('News not found');

    if (updateNewsDto.title) {
      news.title = updateNewsDto.title as string;
      news.slug = slugify(updateNewsDto.title as string, { lower: true });
    }

    if (updateNewsDto.content) news.content = updateNewsDto.content as string;
    if (updateNewsDto.description !== undefined)
      news.description = updateNewsDto.description as string;
    if (updateNewsDto.category)
      news.category = updateNewsDto.category as string;
    if (updateNewsDto.isPublished !== undefined)
      news.isPublished = updateNewsDto.isPublished as boolean;

    if (imageUrl) news.imageUrl = imageUrl;
    if (imagePublicId) news.imagePublicId = imagePublicId;

    return {
      statusCode: HttpStatus.OK,
      message: 'News updated successfully',
      data: await news.save(),
    };
  }

  // Delete news
  async deleteNews(id: string) {
    const news = await this.newsModel.findById(id).exec();

    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    return this.newsModel.findByIdAndDelete(id).exec();
  }
}
