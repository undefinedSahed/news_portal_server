import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class News extends Document {
  @Prop({ required: false })
  imageUrl: string;

  @Prop({ required: false })
  imagePublicId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ unique: true })
  slug: string;

  @Prop({ default: true })
  isPublished: boolean;
}

export const NewsSchema = SchemaFactory.createForClass(News);
