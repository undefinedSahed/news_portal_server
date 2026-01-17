import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateNewsDto } from './dto/create-news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // Create news
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }
}
