import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Show', required: true })
  showId: Types.ObjectId;

  @Prop({ type: [String], required: true })
  seats: string[];

  @Prop({ required: true, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' })
  status: string;

  @Prop()
  amount: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  expiresAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
