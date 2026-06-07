import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WereadBookDocument = HydratedDocument<WereadBook>;

@Schema({ timestamps: true, collection: 'weread_books' })
export class WereadBook {
  @Prop({ required: true, unique: true })
  bookId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ default: '' })
  cover: string;

  @Prop({ required: true })
  readUpdateTime: number;

  @Prop({ default: 0 })
  finishReading: number;
}

export const WereadBookSchema = SchemaFactory.createForClass(WereadBook);
