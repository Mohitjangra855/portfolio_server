import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { AuthGuard } from 'src/guard/admin.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}
@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create Education' })
  @Post()
  createEducation(@Body() createEducationDto: CreateEducationDto) {
    return this.educationService.createEducation(createEducationDto);
  }
  @UseInterceptors(CacheInterceptor)
  @CacheKey('all-education')
  @Get()
  findAllEducation() {
    return this.educationService.findAllEducation();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.educationService.findOne(id);
  // }
@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update Education by ID' })
  @Patch(':id')
  updateEducation(
    @Param('id') id: string,
    @Body() updateEducationDto: UpdateEducationDto,
  ) {
    return this.educationService.updateEducation(id, updateEducationDto);
  }
@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Remove Education by ID' })
  @Delete(':id')
  removeEducation(@Param('id') id: string) {
    return this.educationService.removeEducation(id);
  }
}
