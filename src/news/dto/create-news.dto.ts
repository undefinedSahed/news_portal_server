import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
