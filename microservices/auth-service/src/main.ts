/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  // Create microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: parseInt(process.env.PORT) || 3001,
      },
    },
  );

  await app.listen();
  console.log(`Auth Microservice is running on port ${process.env.PORT || 3001}`);
}
bootstrap();
