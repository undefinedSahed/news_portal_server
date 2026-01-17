import { NewsService } from './news.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateNewsDto } from './dto/create-news.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

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
}
