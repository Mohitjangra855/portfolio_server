import { Injectable, Logger } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { normalizeEmail } from './utils/normalize-email';

type LoginFailureReason = 'user_not_found' | 'invalid_password' | 'jwt_not_configured';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const email = normalizeEmail(createAuthDto.email);
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists',
      };
    }

    const hashedPassword = bcrypt.hashSync(createAuthDto.password, 10);
    const auth = await this.prismaService.user.create({
      data: {
        ...createAuthDto,
        email,
        password: hashedPassword,
      },
    });
    this.logger.log(`User registered: ${email}`);
    return {
      success: true,
      message: 'Auth created successfully',
      data: this.omitPassword(auth),
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const email = normalizeEmail(loginAuthDto.email);
    const { password } = loginAuthDto;

    const user = await this.findUserByEmail(email);
    if (!user) {
      this.logger.warn(`Login failed: user not found (${email})`);
      return {
        success: false,
        message: 'Invalid credentials',
        reason: 'user_not_found' satisfies LoginFailureReason,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Login failed: invalid password (${email})`);
      return {
        success: false,
        message: 'Invalid credentials',
        reason: 'invalid_password' satisfies LoginFailureReason,
      };
    }

    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      this.logger.error('JWT_SECRET or JWT_REFRESH_SECRET is not set');
      return {
        success: false,
        message: 'Authentication service is misconfigured',
        reason: 'jwt_not_configured' satisfies LoginFailureReason,
      };
    }

    const accessToken = this.jwtService.sign(
      { userId: user.id, email: user.email },
      { expiresIn: '7d', secret: process.env.JWT_SECRET },
    );
    const refreshToken = this.jwtService.sign(
      { userId: user.id, email: user.email },
      { expiresIn: '14d', secret: process.env.JWT_REFRESH_SECRET },
    );

    this.logger.log(`Login successful: ${email}`);
    return {
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: this.omitPassword(user),
    };
  }

  /** Exact match first; case-insensitive fallback for emails stored before normalization. */
  private async findUserByEmail(email: string): Promise<User | null> {
    const byNormalized = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (byNormalized) {
      return byNormalized;
    }

    const users = await this.prismaService.user.findMany();
    return users.find((u) => normalizeEmail(u.email) === email) ?? null;
  }

  private omitPassword<T extends { password?: string }>(
    user: T,
  ): Omit<T, 'password'> {
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.userId },
      });
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }
      const newAccessToken = this.jwtService.sign(
        { userId: user.id, email: user.email },
        { expiresIn: '7d', secret: process.env.JWT_SECRET },
      );
      return {
        success: true,
        message: 'Token refreshed successfully',
        accessToken: newAccessToken,
      };
    } catch (err) {
      this.logger.warn('Error refreshing token', err);
      return {
        success: false,
        message: 'Invalid refresh token',
        error: err.message,
      };
    }
  }

  async getProfile() {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { role: 'admin' },
        include: {
          projects: {
            orderBy: [{ createdAt: 'desc' }],
          },
          skills: true,
          education: {
            orderBy: [{ startDate: 'desc' }, { endDate: 'desc' }],
          },
          companies: {
            orderBy: [
              { endYear: 'asc' },
              { startYear: 'desc' },
              { startMonth: 'desc' },
            ],
          },
        },
      });
      if (!user) {
        return null;
      }

      return {
        success: true,
        message: 'User profile retrieved successfully',
        data: this.omitPassword(user),
      };
    } catch (err) {
      this.logger.warn('Error retrieving user profile', err);
      return {
        success: false,
        message: 'Invalid access token',
        error: err.message,
      };
    }
  }

  async verifyToken(accessToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });
      return payload;
    } catch (err) {
      this.logger.warn('Error verifying token', err);
      return null;
    }
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    return user ? this.omitPassword(user) : null;
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    const data: UpdateAuthDto = { ...updateAuthDto };
    if (data.email) {
      data.email = normalizeEmail(data.email);
    }
    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data,
    });
    return {
      success: true,
      message: 'User updated successfully',
      user: this.omitPassword(updatedUser),
    };
  }

  remove(id: string) {
    return this.prismaService.user.delete({
      where: { id: id },
    });
  }
}
