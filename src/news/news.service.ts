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
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name)
    private readonly newsModel: Model<News>,
  ) {}

  // Create News
  async create(
    createNewsDto: CreateNewsDto,
    imageUrl?: string,
    imagePublicId?: string,
  ) {
    const slug = slugify(createNewsDto.title, { lower: true });

    const existingNews = await this.newsModel.findOne({ slug });

    if (existingNews) {
      throw new ConflictException('News with this title already exists');
    }

    const data: Record<string, any> = {
      ...createNewsDto,
      slug,
    };
    if (imageUrl) data.imageUrl = imageUrl;
    if (imagePublicId) data.imagePublicId = imagePublicId;

    return {
      statusCode: HttpStatus.CREATED,
      message: 'News created successfully',
      data: await this.newsModel.create(data),
    };
  }

  // Get all news
  async getAll(page: number, limit: number, category?: string) {
    const filter: Record<string, any> = { isPublished: true };
    if (category) {
      filter.category = category;
    }

    const total = await this.newsModel.countDocuments(filter).exec();
    const data = await this.newsModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    return {
      statusCode: HttpStatus.OK,
      message: 'News fetched successfully',
      data,
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  // Get all news for admin (including unpublished)
  async getAllForAdmin(
    page: number,
    limit: number,
    category?: string,
    isPublished?: boolean,
  ) {
    const filter: Record<string, any> = {};
    if (category) {
      filter.category = category;
    }
    if (isPublished !== undefined) {
      filter.isPublished = isPublished;
    }

    const total = await this.newsModel.countDocuments(filter).exec();
    const data = await this.newsModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    return {
      statusCode: HttpStatus.OK,
      message: 'News fetched successfully',
      data,
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  // Get single news
  async getSingleNews(slug: string) {
    const news = await this.newsModel.findOne({ slug }).exec();

    if (!news) throw new NotFoundException('News not found');

    return {
      statusCode: HttpStatus.OK,
      message: 'News fetched successfully',
      data: news,
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
      news.title = updateNewsDto.title;
      news.slug = slugify(updateNewsDto.title, { lower: true });
    }

    if (updateNewsDto.content) news.content = updateNewsDto.content;
    if (updateNewsDto.description !== undefined)
      news.description = updateNewsDto.description;
    if (updateNewsDto.category) news.category = updateNewsDto.category;
    if (updateNewsDto.isPublished !== undefined)
      news.isPublished = updateNewsDto.isPublished;

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

    const newsImagePublicId = news.imagePublicId;
    if (newsImagePublicId) {
      await cloudinary.uploader.destroy(newsImagePublicId);
    }

    return this.newsModel.findByIdAndDelete(id).exec();
  }

  // Get categories
  async getCategories() {
    const existingCategories = await this.newsModel.distinct('category').exec();
    if (existingCategories.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: 'Categories fetched successfully',
        data: existingCategories,
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'No categories found',
      data: [],
    };
  }
}
