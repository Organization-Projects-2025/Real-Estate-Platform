/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Put, Delete, Body, Param, Res, HttpStatus, Req, UseFilters } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private extractUserIdFromToken(req: Request): string | null {
    try {
      const token = req.cookies?.jwt || req.headers.authorization?.replace('Bearer ', '');
      if (!token) return null;
      
      // Basic JWT decode (in production, use proper verification)
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      return payload.id || payload.sub;
    } catch (error) {
      return null;
    }
  }

  @Post('register')
  async register(@Body() userData: any, @Res() res: Response) {
    try {
      const result = await this.authService.register(userData);
      
      // Set JWT cookie
      if (result.data?.token) {
        res.cookie('jwt', result.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          path: '/',
        });
      }
      
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message || 'Registration failed',
      });
    }
  }

  @Post('login')
  async login(@Body() credentials: { email: string; password: string }, @Res() res: Response) {
    try {
      const result = await this.authService.login(credentials.email, credentials.password);
      
      // Set JWT cookie
      if (result.data?.token) {
        res.cookie('jwt', result.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          path: '/',
        });
      }
      
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: 'error',
        message: error.message || 'Login failed',
      });
    }
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.cookie('jwt', 'loggedout', {
      httpOnly: true,
      expires: new Date(Date.now() + 10 * 1000),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Logged out successfully!',
    });
  }

  @Get('me')
  async getMe(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = this.extractUserIdFromToken(req);
      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          status: 'error',
          message: 'Unauthorized - no token provided',
        });
      }
      const result = await this.authService.getMe(userId);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message || 'Failed to fetch user',
      });
    }
  }

  @Put('me')
  async updateMe(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    try {
      const userId = this.extractUserIdFromToken(req);
      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          status: 'error',
          message: 'Unauthorized - no token provided',
        });
      }
      console.log('API Gateway - updateMe called with userId:', userId, 'body:', body);
      const result = await this.authService.updateMe(userId, body);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error('API Gateway - Error in updateMe:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message || 'Failed to update user',
      });
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }, @Res() res: Response) {
    try {
      const result = await this.authService.forgotPassword(body.email);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message || 'Failed to process forgot password',
      });
    }
  }

  @Post('reset-password/:token')
  async resetPassword(@Param('token') token: string, @Body() body: { password: string }, @Res() res: Response) {
    try {
      const result = await this.authService.resetPassword(token, body.password);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message || 'Failed to reset password',
      });
    }
  }

  @Put('update-password')
  async updatePassword(@Req() req: Request, @Body() body: { currentPassword: string; newPassword: string }, @Res() res: Response) {
    try {
      const userId = this.extractUserIdFromToken(req);
      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          status: 'error',
          message: 'Unauthorized - no token provided',
        });
      }
      const result = await this.authService.updatePassword(userId, body.currentPassword, body.newPassword);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message || 'Failed to update password',
      });
    }
  }

  // Admin routes
  @Get('users')
  async getAllUsers(@Res() res: Response) {
    try {
      const result = await this.authService.getAllUsers();
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message || 'Failed to fetch users',
      });
    }
  }

  @Get('users/role/:role')
  async getUsersByRole(@Param('role') role: string, @Res() res: Response) {
    try {
      const result = await this.authService.getUsersByRole(role);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message || 'Failed to fetch users by role',
      });
    }
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.authService.getUserById(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message || 'Failed to fetch user',
      });
    }
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.authService.deleteUser(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message || 'Failed to delete user',
      });
    }
  }
}
