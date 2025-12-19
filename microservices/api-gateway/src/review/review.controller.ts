/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Body, Param, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(@Body() reviewData: any, @Res() res: Response) {
    try {
      const result = await this.reviewService.create(reviewData);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message || 'Failed to create review',
      });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const result = await this.reviewService.findAll();
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message || 'Failed to fetch reviews',
      });
    }
  }

  @Get('random')
  async getRandom(@Query('limit') limit: number = 3, @Res() res: Response) {
    try {
      const result = await this.reviewService.getRandom(limit);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message || 'Failed to fetch random reviews',
      });
    }
  }

  @Get('agent/:agentId')
  async findByAgent(@Param('agentId') agentId: string, @Res() res: Response) {
    try {
      const result = await this.reviewService.findByAgent(agentId);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message || 'Failed to fetch reviews by agent',
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.reviewService.findById(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message || 'Failed to fetch review',
      });
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any, @Res() res: Response) {
    try {
      const result = await this.reviewService.update(id, updateData);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message || 'Failed to update review',
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.reviewService.delete(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message || 'Failed to delete review',
      });
    }
  }
}
