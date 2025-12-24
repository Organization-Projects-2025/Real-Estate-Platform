/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReviewService {
  constructor(
    @Inject('REVIEW_SERVICE') private readonly reviewClient: ClientProxy,
  ) {}

  async create(reviewData: any): Promise<any> {
    return firstValueFrom(this.reviewClient.send({ cmd: 'createReview' }, reviewData));
  }

  async findAll(): Promise<any> {
    return firstValueFrom(this.reviewClient.send({ cmd: 'getAllReviews' }, {}));
  }

  async findById(id: string): Promise<any> {
    return firstValueFrom(this.reviewClient.send({ cmd: 'getReviewById' }, id));
  }

  async update(id: string, updateData: any): Promise<any> {
    return firstValueFrom(this.reviewClient.send({ cmd: 'updateReview' }, { id, updateData }));
  }

  async delete(id: string): Promise<any> {
    return firstValueFrom(this.reviewClient.send({ cmd: 'deleteReview' }, id));
  }

  async findByAgent(agentId: string): Promise<any> {
    return firstValueFrom(this.reviewClient.send({ cmd: 'getReviewsByAgent' }, agentId));
  }

  async getRandom(limit: number): Promise<any> {
    return firstValueFrom(this.reviewClient.send({ cmd: 'getRandomReviews' }, limit));
  }
}
