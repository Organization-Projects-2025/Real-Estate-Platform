const catchAsync = require('../utils/catchAsync');
const ServiceLocator = require('../core/ServiceLocator');
const ReviewService = require('../services/ReviewService');

// Register the ReviewService
ServiceLocator.register('reviewService', new ReviewService());

// Get the review service instance
const reviewService = ServiceLocator.get('reviewService');

exports.createReview = catchAsync(async (req, res) => {
  const review = await reviewService.execute('create', req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.getAllReviews = catchAsync(async (req, res) => {
  const reviews = await reviewService.execute('getAll');
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getRandomReviews = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 3;
  const reviews = await reviewService.execute('getRandom', { limit });
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getReviewById = catchAsync(async (req, res) => {
  const review = await reviewService.execute('getById', { id: req.params.id });
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.updateReview = catchAsync(async (req, res) => {
  const review = await reviewService.execute('update', {
    id: req.params.id,
    updateData: req.body,
  });
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res) => {
  await reviewService.execute('delete', { id: req.params.id });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
