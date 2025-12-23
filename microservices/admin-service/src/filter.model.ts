/* eslint-disable prettier/prettier */
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Filter extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  category: string; // 'property-type', 'amenities', 'features', etc.

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop()
  description?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const FilterSchema = SchemaFactory.createForClass(Filter);
