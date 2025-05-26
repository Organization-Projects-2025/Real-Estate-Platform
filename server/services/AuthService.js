const BaseService = require('../core/BaseService');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Email = require('../utils/email');
const AppError = require('../utils/appError');

class AuthService extends BaseService {
  constructor() {
    super();
  }

  async perform(action, data) {
    switch (action) {
      case 'register':
        return this.register(data);
      case 'login':
        return this.login(data);
      case 'forgotPassword':
        return this.forgotPassword(data);
      case 'resetPassword':
        return this.resetPassword(data);
      case 'updatePassword':
        return this.updatePassword(data);
      case 'getMe':
        return this.getMe(data);
      case 'updateMe':
        return this.updateMe(data);
      default:
        throw new Error('Invalid action');
    }
  }

  createJWTToken(user) {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60,
    });
  }

  async register({ userData, res }) {
    try {
      console.log('Registration request body:', userData);

      const newUser = await User.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
      });

      console.log('Created user:', newUser);
      this.sendJWTToken(newUser, 201, res);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.name === 'ValidationError') {
        throw new AppError(error.message, 400);
      }
      throw error;
    }
  }

  async login({ email, password, res }) {
    console.log('Login attempt with body:', { email });

    if (!email || !password) {
      console.log('Missing email or password');
      throw new AppError('Please provide email and password!', 400);
    }

    const user = await User.findOne({ email }).select('+password +active');
    if (!user) {
      console.log('User not found:', email);
      throw new AppError('Incorrect email or password!', 401);
    }

    const isPasswordCorrect = await user.isCorrectPassword(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      console.log('Incorrect password for user:', email);
      throw new AppError('Incorrect email or password!', 401);
    }

    if (!user.active) {
      console.log('Inactive account:', email);
      throw new AppError(
        'Your account is deactivated. Please contact support.',
        401
      );
    }

    console.log('Login successful for user:', email);
    this.sendJWTToken(user, 200, res);
  }

  async forgotPassword({ email }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('There is no user with that email address!', 404);
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      const newEmail = new Email(user, resetURL);
      await newEmail.sendPasswordReset();

      return {
        message:
          'A password reset link has been successfully sent to your email. Please check your inbox and follow the instructions to reset your password.',
      };
    } catch (err) {
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save({ validateBeforeSave: false });
      throw new AppError(
        'There was an error sending the email. Please try again later!',
        500
      );
    }
  }

  async resetPassword({ token: resetToken, password, confirmPassword }) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      throw new AppError(
        'Reset Password Token is invalid or has expired!',
        401
      );
    }

    if (!password || !confirmPassword) {
      throw new AppError('Fill required fields!', 400);
    }

    if (password !== confirmPassword) {
      throw new AppError('Passwords do not match!', 400);
    }

    console.log('Fetched user email:', user.email);
    console.log('Old password hash:', user.password);
    console.log('New password:', password);
    if (await bcrypt.compare(password, user.password)) {
      throw new AppError("New password can't be same as old password!", 400);
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    const jwtToken = this.createJWTToken(user);
    return { token: jwtToken };
  }

  async updatePassword({
    userId,
    currentPassword,
    newPassword,
    confirmPassword,
  }) {
    const user = await User.findById(userId).select('+password');

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      throw new AppError('Your current password is wrong!', 401);
    }

    user.password = currentPassword;
    user.confirmPassword = confirmPassword;
    await user.save();

    const token = this.createJWTToken(user);
    return { token, message: 'Password updated successfully!' };
  }

  async getMe({ userId }) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async updateMe({ userId, userData }) {
    if (userData.password || userData.role || userData.authType) {
      throw new AppError('Cannot update password, role, or authType here', 400);
    }

    const allowedFields = [
      'firstName',
      'lastName',
      'email',
      'profilePicture',
      'phoneNumber',
      'whatsapp',
      'contactEmail',
    ];
    const updates = {};
    allowedFields.forEach((field) => {
      if (userData[field]) updates[field] = userData[field];
    });

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!updates.email) {
      throw new AppError('Invalid email address', 400);
    }

    Object.keys(updates).forEach((key) => {
      user[key] = updates[key];
    });

    const updatedUser = await user.save({ validateBeforeSave: true });
    return updatedUser;
  }

  sendJWTToken(user, statusCode, res) {
    const token = this.createJWTToken(user);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
      path: '/',
    });

    user.password = undefined;

    res.status(statusCode).json({
      status: 'success',
      data: {
        user,
      },
    });
  }
}

module.exports = AuthService;
