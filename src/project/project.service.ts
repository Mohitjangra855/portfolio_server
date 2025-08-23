import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { projectData } from './projectData'; // Importing the project data

@Injectable()
export class ProjectService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async createProject(createProjectDto: CreateProjectDto, accessToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken);
      if (!payload || !payload.userId) {
        throw new Error('Invalid access token');
      }
      const userId = payload.userId;

      // Create a new project with the userId
      const project = await this.prismaService.project.create({
        data: {
          ...createProjectDto,
          userId: userId, // Associate the project with the user
        },
      });
      console.log('Project created:', project);
      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  }

  async findAll() {
    const data = await this.prismaService.project.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        }, // Include user details if needed
      },
      orderBy: [
        {
          createdAt: 'desc', // Latest created projects first
        },
        {
          updatedAt: 'desc', // Latest updated projects first
        },
      ],
    });
    console.log('Fetching all projects data from database with proper sorting');

    return {
      success: true,
      message: 'All projects retrieved successfully',
      data,
    };
  }

  findOne(id: string) {
    return this.prismaService.project.findUnique({
      where: { id: id },
    });
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    return this.prismaService.project.update({
      where: { id: id },
      data: updateProjectDto,
    });
  }

  remove(id: string) {
    return this.prismaService.project.delete({
      where: { id: id },
    });
  }

  async createManyProjects() {
    const user = await this.prismaService.user.findFirst({
      where: { role: 'admin' },
    });
    if (!user) {
      throw new Error('Admin user not found');
    }
    const projects = await this.prismaService.project.createMany({
      data: projectData.map((project) => ({
        ...project,
        userId: user.id,
        status: project.status as any, // Cast to 'Status' enum, replace 'any' with 'Status' if importedx 
      })),
    });
    console.log('Projects created:', projects);
    return {
      success: true,
      message: 'Projects created successfully',
      data: projects, // Return the created projects count because createMany returns an object with count not records
    };
  }
}
