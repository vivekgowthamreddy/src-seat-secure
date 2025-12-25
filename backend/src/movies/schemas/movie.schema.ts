import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop()
  posterUrl: string;

  @Prop()
  description: string;

  @Prop()
  duration: string;

  @Prop()
  genre: string;

  @Prop()
  language: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
