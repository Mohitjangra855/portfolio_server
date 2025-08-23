import { Inject, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as cacheManager from 'cache-manager';
@Injectable()
export class CompanyService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('CACHE_MANAGER') private readonly cacheManager: cacheManager.Cache,
  ) {}
  async createCompany(createCompanyDto: CreateCompanyDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        role: 'admin',
      },
    });
    if (!user) {
      throw new Error('Admin user not found');
    }
    const company = await this.prismaService.company.create({
      data: {
        ...createCompanyDto,
        userId: user.id,
      },
    });
    this.cacheManager.del('all-companies'); // Clear cache after creating company
    this.cacheManager.del('user-profile'); // Clear user profile cache
    return {
      success: true,
      message: 'Company created successfully',
      company,
    };
  }

  async findAllCompanies() {
    console.log('Fetching all companies');
    const companies = await this.prismaService.company.findMany({
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
    });
    return {
      success: true,
      message: 'All companies retrieved successfully',
      companies,
    };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} company`;
  // }

  async updateCompany(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.prismaService.company.update({
      where: { id },
      data: updateCompanyDto,
    });
    this.cacheManager.del('all-companies'); // Clear cache after updating company
    this.cacheManager.del('user-profile'); // Clear user profile cache
    return {
      success: true,
      message: 'Company updated successfully',
      company,
    };
  }

  async removeCompany(id: string) {
    await this.prismaService.company.delete({
      where: { id },
    });
    this.cacheManager.del('all-companies'); // Clear cache before removing company
    this.cacheManager.del('user-profile'); // Clear user profile cache
    return {
      success: true,
      message: 'Company removed successfully',
    };
  }
}
