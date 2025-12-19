/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReviewService } from './review.service';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @MessagePattern({ cmd: 'createReview' })
  async create(@Payload() reviewData: any) {
    return this.reviewService.create(reviewData);
  }

  @MessagePattern({ cmd: 'getAllReviews' })
  async findAll() {
    return this.reviewService.findAll();
  }

  @MessagePattern({ cmd: 'getReviewById' })
  async findOne(@Payload() id: string) {
    return this.reviewService.findById(id);
  }

  @MessagePattern({ cmd: 'updateReview' })
  async update(@Payload() data: { id: string; updateData: any }) {
    return this.reviewService.update(data.id, data.updateData);
  }

  @MessagePattern({ cmd: 'deleteReview' })
  async remove(@Payload() id: string) {
    return this.reviewService.delete(id);
  }

  @MessagePattern({ cmd: 'getReviewsByAgent' })
  async findByAgent(@Payload() agentId: string) {
    return this.reviewService.findByAgent(agentId);
  }

  @MessagePattern({ cmd: 'getRandomReviews' })
  async getRandom(@Payload() limit: number) {
    return this.reviewService.getRandom(limit);
  }
}
