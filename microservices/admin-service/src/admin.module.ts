/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilterController } from './filter.controller';
import { FilterService } from './filter.service';
import { Filter, FilterSchema } from './filter.model';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate-admin'),
    MongooseModule.forFeature([{ name: Filter.name, schema: FilterSchema }]),
  ],
  controllers: [FilterController],
  providers: [FilterService],
})
export class AdminModule {}
