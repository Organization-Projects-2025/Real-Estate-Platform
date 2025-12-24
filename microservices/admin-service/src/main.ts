/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AdminModule } from './admin.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AdminModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: parseInt(process.env.PORT) || 3005,
      },
    },
  );

  await app.listen();
  console.log(`Admin Microservice is running on port ${process.env.PORT || 3005}`);
}
bootstrap();
