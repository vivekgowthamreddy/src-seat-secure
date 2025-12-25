import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ShowDocument = Show & Document;

@Schema()
export class Show {
  @Prop({ type: Types.ObjectId, ref: 'Movie', required: true })
  movieId: Types.ObjectId;

  @Prop({ required: true })
  startTime: Date;

  @Prop()
  price: number;

  @Prop()
  theaterName: string;

  @Prop()
  category: string;

  @Prop({ default: 0 })
  bookedSeats: number;

  @Prop({ default: 660 })
  totalSeats: number;
}

export const ShowSchema = SchemaFactory.createForClass(Show);
