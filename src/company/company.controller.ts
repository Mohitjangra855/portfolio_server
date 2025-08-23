import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/admin.guard';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOperation({ summary: 'Create Company' })
  @UseGuards(AuthGuard)
  @Post()
  createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.createCompany(createCompanyDto);
  }
  @UseInterceptors(CacheInterceptor)
  @CacheKey('all-companies')
  @Get()
  findAllCompanies() {
    return this.companyService.findAllCompanies();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.companyService.findOne(+id);
  // }

  @ApiOperation({ summary: 'Update Company by ID' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  updateCompany(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.updateCompany(id, updateCompanyDto);
  }

  @ApiOperation({ summary: 'Remove Company by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  removeCompany(@Param('id') id: string) {
    return this.companyService.removeCompany(id);
  }
}
