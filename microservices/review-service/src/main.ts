/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ReviewModule } from './review.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ReviewModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: parseInt(process.env.PORT) || 3003,
      },
    },
  );

  await app.listen();
  console.log(`Review Microservice is running on port ${process.env.PORT || 3003}`);
}
bootstrap();
