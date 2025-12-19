/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PropertyDocument = Property & Document;

@Schema({ timestamps: true })
export class Address {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  country: string;
}

@Schema({ timestamps: true })
export class Area {
  @Prop({ required: true })
  sqft: number;

  @Prop({ required: true })
  sqm: number;
}

@Schema({ timestamps: true })
export class Features {
  @Prop({ required: true })
  bedrooms: number;

  @Prop({ required: true })
  bathrooms: number;

  @Prop({ required: true })
  garage: number;

  @Prop({ required: true })
  pool: boolean;

  @Prop({ required: true })
  yard: boolean;

  @Prop({ required: true })
  pets: boolean;

  @Prop({ enum: ['fully', 'partly', 'none'], required: true })
  furnished: string;

  @Prop({ required: true })
  airConditioning: boolean;

  @Prop({ required: true })
  internet: boolean;

  @Prop({ required: true })
  electricity: boolean;

  @Prop({ required: true })
  water: boolean;

  @Prop({ required: true })
  gas: boolean;

  @Prop({ required: true })
  wifi: boolean;

  @Prop({ required: true })
  security: boolean;
}

@Schema({ timestamps: true })
export class Property {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: ['sale', 'rent'], required: true })
  listingType: string;

  @Prop({ enum: ['residential', 'commercial'], required: true })
  propertyType: string;

  @Prop({ required: true })
  subType: string;

  @Prop({ type: Address, required: true })
  address: Address;

  @Prop({ type: Area, required: true })
  area: Area;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String], required: true })
  media: string[];

  @Prop({ required: true })
  buildDate: Date;

  @Prop({ required: true })
  user: string;

  @Prop({ enum: ['active', 'sold'], required: true })
  status: string;

  @Prop({ type: Features, required: true })
  features: Features;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
