/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Developer extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Object })
  contact: {
    email?: string;
    phone?: string;
    website?: string;
  };
}

export const DeveloperSchema = SchemaFactory.createForClass(Developer);
