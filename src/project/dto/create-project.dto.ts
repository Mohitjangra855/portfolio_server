import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsUrl,
  IsEnum,
  IsBoolean
} from 'class-validator';
import { Status } from '@prisma/client';

export class CreateProjectDto {
  @ApiProperty({
    example: 'AI Portfolio Generator',
    description: 'Title of the project',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'A project that uses AI to generate portfolios',
    description: 'Short description of the project',
  })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({
    example: 'This project allows users to generate portfolios using AI.',
    description: 'Detailed description of the project',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'ongoing',
    description: 'Current status of the project',
    enum: Status,
  })
  @IsEnum(Status)
  @IsString()
  @IsNotEmpty()
  status: Status;

  @ApiProperty({
    example: '2 months',
    description: 'Duration of the project',
    required: false,
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Optional image URL for the project',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    example: ['NestJS', 'Vue.js', 'MongoDB'],
    description: 'List of technologies used',
  })
  @IsArray()
  @IsString({ each: true })
  technologies: string[];

  @ApiPropertyOptional({
    example: true,
    description: 'Indicates if the project is important',
  })
  @IsOptional()
  @IsBoolean()
  important?: boolean;

  @ApiProperty({
    example: 'https://github.com/username/ai-portfolio',
    description: 'Optional GitHub repository URL',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @ApiProperty({
    example: 'https://ai-portfolio.vercel.app',
    description: 'Optional live URL where the project is deployed',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  liveUrl?: string;
}
