import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new HttpException('Unauthorized - no token provided', HttpStatus.UNAUTHORIZED);
    }

    try {
      const result = await firstValueFrom(
        this.authClient.send({ cmd: 'validateToken' }, token)
      );
      if (!result.valid) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      request.user = result.user;
      return true;
    } catch (error) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return request.cookies?.jwt || null;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new HttpException('Unauthorized - no token provided', HttpStatus.UNAUTHORIZED);
    }

    try {
      const result = await firstValueFrom(
        this.authClient.send({ cmd: 'validateToken' }, token)
      );
      if (!result.valid) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      if (result.user.role !== 'admin') {
        throw new HttpException('Forbidden - admin access required', HttpStatus.FORBIDDEN);
      }
      request.user = result.user;
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return request.cookies?.jwt || null;
  }
}

@Injectable()
export class DeveloperGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new HttpException('Unauthorized - no token provided', HttpStatus.UNAUTHORIZED);
    }

    try {
      const result = await firstValueFrom(
        this.authClient.send({ cmd: 'validateToken' }, token)
      );
      if (!result.valid) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      if (result.user.role !== 'developer') {
        throw new HttpException('Forbidden - developer access required', HttpStatus.FORBIDDEN);
      }
      request.user = result.user;
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return request.cookies?.jwt || null;
  }
}
