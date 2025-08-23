import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({ example: 'admin@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'bnm' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'Mohit Kumar' })
  @IsString()
  name: string;

  @ApiProperty({ example: 23 })
  @IsInt()
  age: number;

  @ApiPropertyOptional({ example: 'admin', enum: ['user', 'admin'] })
  @IsOptional()
  role?: 'user' | 'admin';

  @ApiPropertyOptional({ example: 'https://i.pravatar.cc/300' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 'Software developer' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'hello i am a software developer this is simple bio',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 'Hisar, Haryana, India' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+91-9876543210' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'https://github.com/yourprofile' })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/yourprofile' })
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiPropertyOptional({
    example: 'I am passionate about web development and open source.',
  })
  @IsOptional()
  interestDescription?: string;

  @ApiPropertyOptional({ example: ['JavaScript', 'Vue.js', 'Node.js'] })
  @IsOptional()
  interests?: string[];

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  openSourceContributions?: number;
}
