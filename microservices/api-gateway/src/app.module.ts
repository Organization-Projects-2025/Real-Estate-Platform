/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PropertyController } from './property/property.controller';
import { PropertyService } from './property/property.service';
import { ReviewController } from './review/review.controller';
import { ReviewService } from './review/review.service';
import { AgentController } from './agent/agent.controller';
import { AgentService } from './agent/agent.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST || '127.0.0.1',
          port: parseInt(process.env.AUTH_SERVICE_PORT) || 3001,
        },
      },
      {
        name: 'PROPERTY_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PROPERTY_SERVICE_HOST || '127.0.0.1',
          port: parseInt(process.env.PROPERTY_SERVICE_PORT) || 3002,
        },
      },
      {
        name: 'REVIEW_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.REVIEW_SERVICE_HOST || '127.0.0.1',
          port: parseInt(process.env.REVIEW_SERVICE_PORT) || 3003,
        },
      },
      {
        name: 'AGENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AGENT_SERVICE_HOST || '127.0.0.1',
          port: parseInt(process.env.AGENT_SERVICE_PORT) || 3004,
        },
      },
    ]),
  ],
  controllers: [AuthController, PropertyController, ReviewController, AgentController],
  providers: [AuthService, PropertyService, ReviewService, AgentService],
})
export class AppModule {}
