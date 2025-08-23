import { Inject, Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PrismaService } from '../prisma/prisma.service';
import { skillData } from './skill-data'; // Importing the skill data
import * as cacheManager from 'cache-manager';
@Injectable()
export class SkillService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('CACHE_MANAGER') private cacheManager: cacheManager.Cache,
  ) {}
  async createSkill(createSkillDto: CreateSkillDto) {
    const user = await this.prismaService.user.findFirst({
      where: { role: 'admin' },
    });
    if (!user) {
      throw new Error('Admin user not found');
    }
    const skill = await this.prismaService.skill.create({
      data: {
        ...createSkillDto,
        userId: user?.id,
      },
    });
    this.cacheManager.del('all-skills'); // Clear cache after creating a skill
    this.cacheManager.del('user-profile'); // Clear user profile cache
    return {
      success: true,
      message: 'Skill created successfully',
      data: skill,
    };
  }

  async findAll() {
    const skill = await this.prismaService.skill.findMany();
    return {
      success: true,
      message: 'Skills fetched successfully',
      data: skill,
    };
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    const skill = await this.prismaService.skill.update({
      where: { id },
      data: updateSkillDto,
    });
    this.cacheManager.del('all-skills'); // Clear cache after updating a skill
    this.cacheManager.del('user-profile'); // Clear user profile cache
    return {
      success: true,
      message: 'Skill updated successfully',
      data: skill,
    };
  }

  async remove(id: string) {
    await this.prismaService.skill.delete({
      where: { id },
    });
    this.cacheManager.del('all-skills'); // Clear cache after deleting a skill
    this.cacheManager.del('user-profile'); // Clear user profile cache
    return {
      success: true,
      message: 'Skill deleted successfully',
    };
  }

  // This method creates multiple skills using the skillData array
  async createManySkills() {
    const user = await this.prismaService.user.findFirst({
      where: { role: 'admin' },
    });
    if (!user) {
      throw new Error('Admin user not found');
    }
    const skills = await this.prismaService.skill.createMany({
      data: skillData.map((skill) => ({
        ...skill,
        userId: user.id,
        tech: skill.tech as any, // Cast to 'Tech' enum, replace 'any' with 'Tech' if imported
      })),
    });
    //mujhe created skills ko return karna hai
    if (skills.count === 0) {
      return {
        success: false,
        message: 'No skills created',
      };
    }

    return {
      success: true,
      message: 'Skills created successfully',
      data: skills, // Return the created skills count because createMany returns an object with count not records
    };
  }
}
