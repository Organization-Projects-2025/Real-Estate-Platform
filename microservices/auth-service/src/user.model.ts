/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'local' })
  authType: string;

  @Prop({ default: '' })
  profilePicture: string;

  @Prop({ enum: ['user', 'agent', 'admin', 'developer'], default: 'user' })
  role: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  whatsapp: string;

  @Prop()
  contactEmail: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ type: [String], default: [] })
  savedProperties: string[];

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordTokenExpiry: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
