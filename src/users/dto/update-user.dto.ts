/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  username: string;
}
