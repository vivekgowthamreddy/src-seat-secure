import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GlobalSeatDocument = GlobalSeat & Document;

@Schema()
export class GlobalSeat {
    @Prop({ required: true, unique: true })
    seatLabel: string; // e.g., 'A1'

    @Prop({ required: true, default: false })
    isDamaged: boolean;
}

export const GlobalSeatSchema = SchemaFactory.createForClass(GlobalSeat);
