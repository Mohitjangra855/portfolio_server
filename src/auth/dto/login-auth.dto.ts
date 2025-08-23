import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    description: 'The email of the user',
    example: "admin@gmail.com"
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: "bnm"
  })
  @IsString()
  password: string;
}