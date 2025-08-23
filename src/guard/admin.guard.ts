import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { async, find } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service'; // Adjust the import path as necessary

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private prismaService: PrismaService) {}

async canActivate(context: ExecutionContext): Promise<boolean> {
  const request = context.switchToHttp().getRequest<Request>();
  const token = this.extractTokenFromHeader(request);
  // console.log('Token:', token); // 🔍

  if (!token) {
    throw new UnauthorizedException('User not authenticated');
  }

  try {
    const payload = this.jwtService.decode(token, { complete: true }).payload; // 🔍
    request['user'] = payload;

    // console.log('Decoded Payload:', payload); // 🔍

    const user = await this.findOneUser(payload.userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // console.log('User found:', user); // 🔍

    if (user.role !== 'admin') {
      throw new UnauthorizedException('User does not have admin privileges');
    }
    return true;
  } catch (err) {
    throw new UnauthorizedException('Invalid or expired token');
  }
}

  
  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.cookies;
    if (!authHeader) return undefined;
    const token = authHeader['access_token'];
    if (!token) return undefined;
    return token;
  }

  private async findOneUser(userId: string) {
    return await this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }
}
