/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { PropertyModule } from './property.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PropertyModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: parseInt(process.env.PORT) || 3002,
      },
    },
  );

  await app.listen();
  console.log(`Property Microservice is running on port ${process.env.PORT || 3002}`);
}
bootstrap();
