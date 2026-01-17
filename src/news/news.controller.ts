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
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { v2 as cloudinary } from 'cloudinary';
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
    let imageUrl: string | undefined;
    let imagePublicId: string | undefined;

    if (file && file.path) {
      const imageResult = await cloudinary.uploader.upload(file.path, {
        folder: 'news-images',
      });
      imageUrl = imageResult.secure_url;
      imagePublicId = imageResult.public_id;
    }

    return this.newsService.create(dto, imageUrl, imagePublicId);
  }

  // Get all news
  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('category') category?: string,
  ) {
    return this.newsService.getAll(+page, +limit, category);
  }

  // Get all news for admin (including unpublished)
  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  @HttpCode(HttpStatus.OK)
  getAllForAdmin(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('category') category?: string,
    @Query('isPublished') isPublished?: string,
  ) {
    const isPublishedBool =
      isPublished === undefined ? undefined : isPublished === 'true';
    return this.newsService.getAllForAdmin(
      +page,
      +limit,
      category,
      isPublishedBool,
    );
  }

  // Get categories
  @Get('categories')
  @HttpCode(HttpStatus.OK)
  getCategories() {
    return this.newsService.getCategories();
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
    let imageUrl: string | undefined;
    let imagePublicId: string | undefined;

    if (file && file.path) {
      const imageResult = await cloudinary.uploader.upload(file.path, {
        folder: 'news-images',
      });
      imageUrl = imageResult.secure_url;
      imagePublicId = imageResult.public_id;
    }

    return this.newsService.updateNews(id, dto, imageUrl, imagePublicId);
  }
}
