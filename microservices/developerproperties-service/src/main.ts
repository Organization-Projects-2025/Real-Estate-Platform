/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DeveloperPropertiesModule } from './developerproperties.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DeveloperPropertiesModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: parseInt(process.env.PORT) || 3006,
      },
    },
  );

  await app.listen();
  console.log(`Developer Properties Microservice is running on port ${process.env.PORT || 3006}`);
}
bootstrap();
