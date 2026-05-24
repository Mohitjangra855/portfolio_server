import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { NormalizeEmail, TrimPassword } from './auth-email.transform';

export class LoginAuthDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'admin@gmail.com',
  })
  @NormalizeEmail()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'bnm',
  })
  @TrimPassword()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  password: string;
}