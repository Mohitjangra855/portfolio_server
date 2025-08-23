import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UseInterceptors,
  Inject,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import * as cacheManager from 'cache-manager';
import { AuthGuard } from '../guard/admin.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('CACHE_MANAGER') private cacheManager: cacheManager.Cache,
  ) {}

  @ApiBody({ type: CreateAuthDto })
  @ApiOperation({ summary: 'User Registration' })
  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }
  @UseInterceptors(CacheInterceptor)
  @CacheKey('current-user')
  @ApiBody({ type: LoginAuthDto })
  @ApiOperation({ summary: 'User Login' })
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginAuthDto: LoginAuthDto,
  ) {
    const user = await this.authService.login(loginAuthDto);
    
    if (!user.success) {
      return {
        success: false,
        message: user.message,
      };
    }
    console.log("user login success:", user); 
    // cookie or session handling can be added here

    res.cookie('access_token', user.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:  7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
    });
    res.cookie('refresh_token', user.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 7 * 24 * 60 * 60 * 1000, // 2 weeks in milliseconds
    });

    return {
      success: true,
      message: 'Login successful',
      user:user.user
    };
  }
  // Refresh token endpoint
  @ApiOperation({ summary: 'Refresh Token' })
  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const refreshTokenDto = {
      refreshToken: req.cookies.refresh_token,
    };
    if (!refreshTokenDto.refreshToken) {
      return {
        success: false,
        message: 'Refresh token is missing',
      };
    }
    const result = await this.authService.refresh(refreshTokenDto.refreshToken);
    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }
    // Set new cookies for access and refresh tokens
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15 * 7, // 7 days in milliseconds
    });
    res.cookie('refresh_token', refreshTokenDto.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 7 * 24 * 60 * 60 * 1000, // 14d in milliseconds
    });
    console.log('Token refreshed successfully');

    return result;
  }
  // Logout endpoint
  @ApiOperation({ summary: 'User Logout' })
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    this.cacheManager.del('current-user');
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Check Authentication Status' })
  @Get('check')
  async checkAuth(@Req() req: Request) {
    // If guard passes, user is authenticated
    const user = req['user']; // User data from guard
    return {
      success: true,
      message: 'User is authenticated',
      user: user,
      isAuthenticated: true
    };
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('user-profile')
  @ApiOperation({ summary: 'Get User Profile' })
  @Get('profile')
  async getProfile() {
    const user = await this.authService.getProfile();
    console.log("Fetched user profile from database");
    
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }
    
    return {
      success: true,
      user: user.data,
    };
  }

 
  @ApiOperation({ summary: 'Update User Profile' })
  @Patch(':id')
  async updateProfile(
    @Param('id') id: string,
    // @Req() req: Request,
    @Body() updateAuthDto: UpdateAuthDto,
  ) {
    // const accessToken = req.cookies.access_token;
    // if (!accessToken) {
    //   return {
    //     success: false,
    //     message: 'Access token is missing',
    //   };
    // }

    try {
      // Verify token and get user ID
      // const payload = await this.authService.verifyToken(accessToken);
      // if (!payload) {
      //   return {
      //     success: false,
      //     message: 'Invalid access token',
      //   };
      // }
      console.log('this is the id', id);
      const result = await this.authService.update(
        id,
        // payload.userId,
        updateAuthDto,
      );
      if (!result) {
        return {
          success: false,
          message: 'Failed to update profile',
        };
      }
      console.log('Profile updated successfully');
      // Clear the specific cache key so next getProfile will fetch fresh data
      await this.cacheManager.del('user-profile');
      await this.cacheManager.del('current-user');
      
      return {
        success: true,
        message: 'Profile updated successfully',
        user: result.user,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update profile',
        error: error.message,
      };
    }
  }

   //   @ApiOperation({summary: 'Update User Profile'})
  // @Patch(':id')
  // upUser(
  //   @Param('id') id: string,
  //   @Body() updateAuthDto: UpdateAuthDto,
  // ){
  // console.log(updateAuthDto)
  // console.log(id)
  // return{
  //   success:true,
  //   message:'User updated successfully',
  //   data:{
  //     id,
  //     ...updateAuthDto
  //   }
  // }
  // }

  @ApiOperation({ summary: 'Get User by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.authService.findOne(id);
    if (!result) {
      return {
        success: false,
        message: 'User not found',
      };
    }
    return {
      success: true,
      data: result,
    };
  }

  @ApiOperation({ summary: 'Delete User' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.authService.remove(id);
    this.cacheManager.del('user-profile');
    this.cacheManager.del('current-user');
    if (!result) {
      return {
        success: false,
        message: 'User not found',
      };
    }
    return {
      success: true,
      message: 'User removed successfully',
      data: result,
    };
  }
}
