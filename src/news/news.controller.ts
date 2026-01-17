import { NewsService } from './news.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateNewsDto } from './dto/create-news.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { UpdateNewsDto } from './dto/update-news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // Create news
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({}),
    }),
  )
  async create(
    @Body() dto: CreateNewsDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imageResult: UploadApiResponse | null = null;

    if (file && file.path) {
      imageResult = await cloudinary.uploader.upload(file.path, {
        folder: 'news-images',
      });
    }

    return this.newsService.create(
      dto,
      imageResult?.secure_url as string,
      imageResult?.public_id,
    );
  }

  // Get all news
  @Get()
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.newsService.getAll();
  }

  // get single news
  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  getSingleNews(@Param('slug') slug: string) {
    return this.newsService.getSingleNews(slug);
  }

  // Delete news
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteNews(@Param('id') id: string) {
    return this.newsService.deleteNews(id);
  }

  // Update news
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({}),
    }),
  )
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateNews(
    @Param('id') id: string,
    @Body() dto: UpdateNewsDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imageResult: UploadApiResponse | null = null;

    if (file && file.path) {
      imageResult = await cloudinary.uploader.upload(file.path, {
        folder: 'news-images',
      });
    }

    return this.newsService.updateNews(
      id,
      dto,
      imageResult?.secure_url,
      imageResult?.public_id,
    );
  }
}
