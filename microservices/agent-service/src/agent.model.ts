/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AgentDocument = Agent & Document;

@Schema({ timestamps: true })
export class Agent {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  contactEmail: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ default: 0 })
  totalSales: number;

  @Prop({ required: true })
  yearsOfExperience: number;

  @Prop({ required: true })
  age: number;

  @Prop()
  about: string;

  @Prop()
  user: string;

  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status: string;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
