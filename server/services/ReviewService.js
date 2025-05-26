const BaseService = require('../core/BaseService');
const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');

class ReviewService extends BaseService {
  constructor() {
    super();
  }

  async perform(action, data) {
    switch (action) {
      case 'create':
        return this.createReview(data);
      case 'getAll':
        return this.getAllReviews();
      case 'getRandom':
        return this.getRandomReviews(data);
      case 'getById':
        return this.getReviewById(data);
      case 'update':
        return this.updateReview(data);
      case 'delete':
        return this.deleteReview(data);
      default:
        throw new Error('Invalid action');
    }
  }

  async createReview(reviewData) {
    const newReview = await Review.create(reviewData);
    return newReview;
  }

  async getAllReviews() {
    const reviews = await Review.find()
      .populate({
        path: 'agent',
        select: 'firstName lastName',
        options: { lean: true },
      })
      .sort({ createdAt: -1 });
    return reviews;
  }

  async getRandomReviews({ limit = 3 }) {
    const reviews = await Review.aggregate([
      { $sample: { size: limit } },
      {
        $lookup: {
          from: 'agents',
          localField: 'agent',
          foreignField: '_id',
          as: 'agentDetails',
        },
      },
      {
        $unwind: '$agentDetails',
      },
      {
        $project: {
          _id: 1,
          reviewerName: 1,
          rating: 1,
          reviewText: 1,
          date: 1,
          agent: {
            firstName: '$agentDetails.firstName',
            lastName: '$agentDetails.lastName',
          },
        },
      },
    ]);
    return reviews;
  }

  async getReviewById({ id }) {
    const review = await Review.findById(id).populate(
      'agent',
      'firstName lastName'
    );

    if (!review) {
      throw new AppError(`No review found with ID: ${id}`, 404);
    }

    return review;
  }

  async updateReview({ id, updateData }) {
    const { rating, reviewText } = updateData;

    if (!rating || !reviewText) {
      throw new AppError(
        'Please provide all required fields: rating and reviewText',
        400
      );
    }

    if (rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { rating, reviewText, updatedAt: Date.now() },
      {
        new: true,
        runValidators: true,
      }
    ).populate('agent', 'firstName lastName');

    if (!review) {
      throw new AppError(`No review found with ID: ${id}`, 404);
    }

    return review;
  }

  async deleteReview({ id }) {
    const review = await Review.findById(id);

    if (!review) {
      throw new AppError(`No review found with ID: ${id}`, 404);
    }

    await Review.findByIdAndDelete(id);
    return null;
  }
}

module.exports = ReviewService;
