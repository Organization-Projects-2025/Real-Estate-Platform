/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeveloperPropertiesController } from './developerproperties.controller';
import { DeveloperPropertiesService } from './developerproperties.service';
import { DeveloperProperty, DeveloperPropertySchema } from './developerproperty.model';
import { Developer, DeveloperSchema } from './developer.model';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/developerproperties'),
    MongooseModule.forFeature([
      { name: DeveloperProperty.name, schema: DeveloperPropertySchema },
      { name: Developer.name, schema: DeveloperSchema },
    ]),
  ],
  controllers: [DeveloperPropertiesController],
  providers: [DeveloperPropertiesService],
})
export class DeveloperPropertiesModule {}
