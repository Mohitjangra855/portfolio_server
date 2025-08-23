import { Inject, Injectable } from '@nestjs/common';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as cacheManager from 'cache-manager';
@Injectable()
export class EducationService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('CACHE_MANAGER') private readonly cacheManager: cacheManager.Cache,
  ) {}
  async createEducation(createEducationDto: CreateEducationDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        role: 'admin',
      },
    });
    if (!user) {
      throw new Error('Admin user not found');
    }
    const education = await this.prismaService.education.create({
      data: {
        ...createEducationDto,
        userId: user.id,
      },
    });
    this.cacheManager.del('all-education'); // Clear cache after creating education
    this.cacheManager.del('user-profile'); // Clear user profile cache
    return {
      success: true,
      message: 'Education created successfully',
      education,
    };
  }

  async findAllEducation() {
    const education = await this.prismaService.education.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    return {
      success: true,
      message: 'All education records retrieved successfully',
      education,
    };
  }

  async updateEducation(id: string, updateEducationDto: UpdateEducationDto) {
    const education = await this.prismaService.education.update({
      where: { id: id },
      data: updateEducationDto,
    });
    this.cacheManager.del('all-education'); // Clear cache after updating education
    this.cacheManager.del('user-profile'); // Clear user profile cache
    return {
      success: true,
      message: `Education record is updated successfully`,
      education,
    };
  }

  async removeEducation(id: string) {
    const education = await this.prismaService.education.delete({
      where: { id },
    });
    this.cacheManager.del('all-education'); // Clear cache after removing education
    this.cacheManager.del('user-profile'); // Clear user profile cache
    return {
      success: true,
      message: `Education record is removed successfully`,
      education,
    };
  }
}
