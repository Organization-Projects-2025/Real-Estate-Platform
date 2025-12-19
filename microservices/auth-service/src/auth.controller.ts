/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register' })
  async register(@Payload() userData: any) {
    return this.authService.register(userData);
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() credentials: { email: string; password: string }) {
    return this.authService.login(credentials.email, credentials.password);
  }

  @MessagePattern({ cmd: 'validateToken' })
  async validateToken(@Payload() token: string) {
    return this.authService.validateToken(token);
  }

  @MessagePattern({ cmd: 'getMe' })
  async getMe(@Payload() userId: string) {
    return this.authService.getUserById(userId);
  }

  @MessagePattern({ cmd: 'updateMe' })
  async updateMe(@Payload() data: { userId: string; userData: any }) {
    return this.authService.updateUser(data.userId, data.userData);
  }

  @MessagePattern({ cmd: 'forgotPassword' })
  async forgotPassword(@Payload() data: { email: string }) {
    return this.authService.forgotPassword(data.email);
  }

  @MessagePattern({ cmd: 'resetPassword' })
  async resetPassword(@Payload() data: { token: string; password: string }) {
    return this.authService.resetPassword(data.token, data.password);
  }

  @MessagePattern({ cmd: 'updatePassword' })
  async updatePassword(@Payload() data: { userId: string; currentPassword: string; newPassword: string }) {
    return this.authService.updatePassword(data.userId, data.currentPassword, data.newPassword);
  }

  @MessagePattern({ cmd: 'getAllUsers' })
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @MessagePattern({ cmd: 'getUserById' })
  async getUserById(@Payload() userId: string) {
    return this.authService.getUserById(userId);
  }

  @MessagePattern({ cmd: 'deleteUser' })
  async deleteUser(@Payload() userId: string) {
    return this.authService.deleteUser(userId);
  }
}
