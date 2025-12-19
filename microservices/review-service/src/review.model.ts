/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'Agent' })
  agent: Types.ObjectId;

  @Prop({ required: true })
  reviewerName: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  reviewText: string;

  @Prop({ default: Date.now })
  date: Date;

  @Prop({ enum: ['active', 'hidden'], default: 'active' })
  status: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
