/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async register(userData: any): Promise<any> {
    return firstValueFrom(this.authClient.send({ cmd: 'register' }, userData));
  }

  async login(email: string, password: string): Promise<any> {
    return firstValueFrom(this.authClient.send({ cmd: 'login' }, { email, password }));
  }

  async validateToken(token: string): Promise<any> {
    return firstValueFrom(this.authClient.send({ cmd: 'validateToken' }, token));
  }

  async getMe(userId: string): Promise<any> {
    return firstValueFrom(this.authClient.send({ cmd: 'getMe' }, userId));
  }

  async updateMe(userId: string, userData: any): Promise<any> {
    return firstValueFrom(this.authClient.send({ cmd: 'updateMe' }, { userId, userData }));
  }

  async forgotPassword(email: string): Promise<any> {
    return firstValueFrom(this.authClient.send({ cmd: 'forgotPassword' }, { email }));
  }

  async resetPassword(token: string, password: string): Promise<any> {
    return firstValueFrom(this.authClient.send({ cmd: 'resetPassword' }, { token, password }));
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<any> {
    return firstValueFrom(this.authClient.send({ cmd: 'updatePassword' }, { userId, currentPassword, newPassword }));
  }

  async getAllUsers(): Promise<any> {
    return firstValueFrom(this.authClient.send({ cmd: 'getAllUsers' }, {}));
  }

  async getUserById(userId: string): Promise<any> {
    return firstValueFrom(this.authClient.send({ cmd: 'getUserById' }, userId));
  }

  async deleteUser(userId: string): Promise<any> {
    return firstValueFrom(this.authClient.send({ cmd: 'deleteUser' }, userId));
  }

  async getUsersByRole(role: string): Promise<any> {
    return firstValueFrom(this.authClient.send({ cmd: 'getUsersByRole' }, role));
  }
}
