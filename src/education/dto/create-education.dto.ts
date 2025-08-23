import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateEducationDto {
    @ApiProperty({ example: 'Harvard University' })
    @IsString()
    institution: string;
    @ApiProperty({ example: 'Bachelor of Science' })
    @IsString()
    degree: string;
    @ApiProperty({ example: 2023 })
    @IsInt()                
    startDate: number;
    @ApiPropertyOptional({ example: 2024 })
    @IsOptional()
    @IsInt()
    endDate: number;
    
    description?: string;
    @ApiProperty({ example: 1 })
    @IsInt()
    totalYears: number;
}







