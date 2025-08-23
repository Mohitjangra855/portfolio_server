import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { AuthGuard } from '../guard/admin.guard';
import { ApiOperation } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager/dist/interceptors/cache.interceptor';
import { CacheKey } from '@nestjs/cache-manager';
@Controller('skill')
export class SkillController {
  constructor(
    private readonly skillService: SkillService
  ) {}

  @ApiOperation({ summary: 'Create Skill' })
  @UseGuards(AuthGuard)
  @Post()
  createSkill(@Body() createSkillDto: CreateSkillDto) {
    return this.skillService.createSkill(createSkillDto);
  }

  

  @UseInterceptors(CacheInterceptor)
  @CacheKey('all-skills')
  @ApiOperation({ summary: 'Get All Skills' })
  @Get()
  findAll() {
    return this.skillService.findAll();
  }

  @ApiOperation({ summary: 'Update Skill by ID' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillService.update(id, updateSkillDto);
  }

  @ApiOperation({ summary: 'Delete Skill by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillService.remove(id);
  }
//create bulk data if need
  // @ApiOperation({ summary: 'Create Multiple Skills' })
  // @Post('bulk')
  // createManySkills() {
  //   return this.skillService.createManySkills();
  // }
}
