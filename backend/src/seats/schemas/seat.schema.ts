import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SeatDocument = Seat & Document;

@Schema()
export class Seat {
  @Prop({ type: Types.ObjectId, ref: 'Show', required: true })
  showId: Types.ObjectId;

  @Prop({ required: true })
  seatLabel: string;

  @Prop({ required: true })
  row: string;

  @Prop({ required: true })
  number: number;

  @Prop({ required: true, enum: ['available', 'booked', 'unavailable'], default: 'available' })
  status: string;

  @Prop()
  bookedBy: string;
}

export const SeatSchema = SchemaFactory.createForClass(Seat);
