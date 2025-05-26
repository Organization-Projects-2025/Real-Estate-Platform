// Core Modules //
const crypto = require('crypto');
const { promisify } = require('util');

// 3rd Party Modules //
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Internal Modules //
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const ServiceLocator = require('../core/ServiceLocator');
const AuthService = require('../services/AuthService');

// Register the AuthService
ServiceLocator.register('authService', new AuthService());

// Get the auth service instance
const authService = ServiceLocator.get('authService');

const sendAuthResponse = (user, token, statusCode, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
    path: '/',
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
      token,
    },
  });
};

exports.register = catchAsync(async (req, res, next) => {
  await authService.execute('register', { userData: req.body, res });
});

exports.login = catchAsync(async (req, res, next) => {
  await authService.execute('login', { ...req.body, res });
});

exports.logout = catchAsync(async (req, res) => {
  res.cookie('jwt', 'loggedout', {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    domain:
      process.env.NODE_ENV === 'production'
        ? process.env.COOKIE_DOMAIN
        : 'localhost',
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully!',
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const result = await authService.execute('forgotPassword', req.body);
  res.status(200).json({
    status: 'success',
    data: result,
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const result = await authService.execute('resetPassword', {
    token: req.params.token,
    ...req.body,
  });
  res.status(201).json({
    status: 'success',
    data: result,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const result = await authService.execute('updatePassword', {
    userId: req.user.id,
    ...req.body,
  });
  res.status(200).json({
    status: 'success',
    data: result,
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const result = await authService.execute('getMe', { userId: req.user.id });
  res.status(200).json({
    status: 'success',
    data: {
      user: result,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const result = await authService.execute('updateMe', {
    userId: req.user.id,
    userData: req.body,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: result,
    },
  });
});
