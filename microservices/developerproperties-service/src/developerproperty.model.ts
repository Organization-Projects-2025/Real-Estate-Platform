/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class DeveloperProperty extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  developerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, enum: ['sale', 'rent'] })
  listingType: string;

  @Prop({ required: true })
  propertyType: string;

  @Prop({ type: Object })
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };

  @Prop({ type: Object })
  area: {
    sqft?: number;
    sqm?: number;
  };

  @Prop({ type: Object })
  features: {
    bedrooms?: number;
    bathrooms?: number;
    garage?: number;
    pool?: boolean;
    yard?: boolean;
    pets?: boolean;
    furnished?: string;
  };

  @Prop({ type: [String] })
  images: string[];

  @Prop({ default: 'active' })
  status: string;
}

export const DeveloperPropertySchema = SchemaFactory.createForClass(DeveloperProperty);
