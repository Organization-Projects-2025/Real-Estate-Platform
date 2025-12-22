/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  developerId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  location: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  startDate: Date;

  @Prop()
  expectedCompletionDate: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);