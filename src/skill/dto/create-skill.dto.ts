import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";
export enum Tech {
  frontendTech = 'frontendTech',
  backendTech = 'backendTech',
  databaseTech = 'databaseTech',
  deploymentTech = 'deploymentTech',
  developmentTools = 'developmentTools',
  designTools = 'designTools',
}



export class CreateSkillDto {
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the skill',
    example: 'JavaScript',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Description of the skill',
    example: 'A versatile programming language primarily used for web development.',
  })
  description: string; 

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Image URL of the skill',
    example: 'https://example.com/image.png',
  })
  image: string;

  @IsEnum(Tech)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The technology category of the skill',
    example: 'frontendTech',
    enum: Tech,
  })
  tech: Tech;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Proficiency level of the skill (0-100)',
    example: 85,
  })
  proficiency: number;
}
