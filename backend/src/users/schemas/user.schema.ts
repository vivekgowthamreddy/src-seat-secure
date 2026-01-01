import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  passwordHash?: string;

  @Prop({ required: true, enum: ['student', 'admin'], default: 'student' })
  role: string;

  @Prop()
  name: string;

  @Prop({ enum: ['male', 'female'] })
  gender: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  verificationToken: string;

  @Prop()
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
