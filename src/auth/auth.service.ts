import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../prisma/prisma.service'; // Adjust the import path as necessary
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async register(createAuthDto: CreateAuthDto) {
    // Check if the user already exists
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: createAuthDto.email },
    });
    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists',
      };
    }
    // Create a new user
    const hashedPassword = bcrypt.hashSync(createAuthDto.password, 10);
    createAuthDto.password = hashedPassword; // Store the hashed password
    const auth = await this.prismaService.user.create({
      data: createAuthDto,
    });
    console.log('Auth created:', auth);
    return {
      success: true,
      message: 'Auth created successfully',
      data: auth,
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid password',
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
    return {
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user,
    };
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
      console.log('Error refreshing token:', err);
      return {
        success: false,
        message: 'Invalid refresh token',
        error: err.message,
      };
    }
  }
  async getProfile() {
    try {
      console.log('Fetching user profile from service');
      const user = await this.prismaService.user.findFirst({
        where: { role: 'admin' }, // Adjust the query as needed
        include: {
          projects: {
            orderBy: [{ createdAt: 'desc' }],
          }, // Include user's projects
          skills: true, // Include user's skills
          education: {
            orderBy: [{ startDate: 'desc' }, { endDate: 'desc' }],
          }, // Include user's education
          companies: {
            orderBy: [
              {
                endYear: 'asc', // null values first (Prisma default for asc is NULLs first)
              },
              {
                startYear: 'desc',
              },
              {
                startMonth: 'desc',
              },
            ],
          }, // Include user's companies - latest first
        },
      });
      console.log('User profile all data retrieved in service');
      if (!user) {
        return null;
      }

      return {
        success: true,
        message: 'User profile retrieved successfully',
        data: user,
      };
    } catch (err) {
      console.log('Error retrieving user profile:', err);
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
      console.log('Error verifying token:', err);
      return null;
    }
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: updateAuthDto,
    });
    return {
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  remove(id: string) {
    return this.prismaService.user.delete({
      where: { id: id },
    });
  }
}
