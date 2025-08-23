import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateCompanyDto {
  @ApiProperty({ example: 'Tech Solutions' })
  @IsString()
  company: string;

  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  position: string;

//     startMonth  Int      // 1-12
//   startYear   Int
//   endMonth    Int?     // 1-12
//   endYear     Int?     // Null if currently working
//   isPresent   Boolean  @default(false)
    @ApiProperty({ example: 2023 })
    @IsInt()
    startYear: number;
    @ApiPropertyOptional({ example: 1 })
    @IsInt()
    startMonth: number;
    @ApiPropertyOptional({ example: 2024 })
    @IsInt()
    endYear: number;
    @ApiPropertyOptional({ example: 1 })
    @IsInt()
    endMonth: number;

    @ApiPropertyOptional({ example: 'A leading tech solutions provider' })
    @IsString()
    @IsOptional()
    description?: string;
}
