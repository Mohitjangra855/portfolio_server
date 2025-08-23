import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthGuard } from 'src/guard/admin.guard';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import * as cacheManager from 'cache-manager';
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService,
    @Inject('CACHE_MANAGER') private cacheManager: cacheManager.Cache,
  ) {}
  // This endpoint is used to create a new project
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateProjectDto })
  @ApiOperation({ summary: 'Create a new project' })
  @Post()
  async createProject(
    @Req() req: Request,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    const accessToken = req.cookies['access_token'];
    if (!accessToken) {
      return {
        success: false,
        message: 'Access token is required',
      };
    }
    const result = await this.projectService.createProject(
      createProjectDto,
      accessToken,
    );
    if (!result) {
      return {
        success: false,
        message: 'Failed to create project',
      };
    }
    this.cacheManager.del('all-projects'); // Clear all projects cache
    this.cacheManager.del('user-profile'); // Clear user profile cache
    return {
      success: true,
      message: 'Project created successfully',
      project: result,
    };
  }
  

  // This endpoint is used to get all projects
  @UseInterceptors(CacheInterceptor)
  @CacheKey('all-projects')
  @ApiOperation({ summary: 'Get All Projects' })
  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  // This endpoint is used to update a project by ID
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update Project by ID' })
  @ApiBody({ type: UpdateProjectDto })
  @Patch(':id')
 async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
   const result = await  this.projectService.update(id, updateProjectDto);
    if (!result) {
      return {
        success: false,
        message: 'Failed to update project',
      };
    }
    this.cacheManager.del('all-projects'); // Clear all projects cache
    this.cacheManager.del('user-profile'); // Clear user profile cache
    return {
      success: true,
      message: `Project with id ${id} updated successfully`,
      project: result,
    };
  }

  @ApiOperation({ summary: 'Get Project by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const project = await this.projectService.findOne(id);
    if (!project) {
      return {
        success: false,
        message: 'Project not found',
      };
    }
    return {
      success: true,
      project,
    };
  }

  // This endpoint is used to delete a project by ID
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete Project by ID' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.projectService.remove(id);
    if (!result) {
      return {
        success: false,
        message: 'Failed to delete project',
      };
    }
    this.cacheManager.del('all-projects'); // Clear all projects cache
    this.cacheManager.del('user-profile'); // Clear user profile cache
    return {
      success: true,
      message: `Project with id ${id} deleted successfully`,
    };
  }

  //inset bulk projects
  // @UseGuards(AuthGuard)
  // @ApiOperation({ summary: 'Store projects in bulk' })
  // @Post("bulk")
  // async createManyProjects() {
  // return this.projectService.createManyProjects();
  // }
}
