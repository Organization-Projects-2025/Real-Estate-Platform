/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './review.model';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(reviewData: any): Promise<any> {
    try {
      const review = await this.reviewModel.create(reviewData);
      return {
        status: 'success',
        data: { review },
      };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to create review', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<any> {
    const reviews = await this.reviewModel.find().populate('agent');
    return {
      status: 'success',
      results: reviews.length,
      data: { reviews },
    };
  }

  async findById(id: string): Promise<any> {
    const review = await this.reviewModel.findById(id).populate('agent');
    if (!review) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      data: { review },
    };
  }

  async update(id: string, updateData: any): Promise<any> {
    const review = await this.reviewModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!review) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      data: { review },
    };
  }

  async delete(id: string): Promise<any> {
    const review = await this.reviewModel.findByIdAndDelete(id);
    if (!review) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      message: 'Review deleted successfully',
    };
  }

  async findByAgent(agentId: string): Promise<any> {
    const reviews = await this.reviewModel.find({ agent: agentId });
    return {
      status: 'success',
      results: reviews.length,
      data: { reviews },
    };
  }

  async getRandom(limit: number = 3): Promise<any> {
    const numLimit = Number(limit) || 3;
    const reviews = await this.reviewModel.aggregate([
      { $match: { status: 'active' } },
      { $sample: { size: numLimit } },
    ]);
    return {
      status: 'success',
      results: reviews.length,
      data: { reviews },
    };
  }
}
