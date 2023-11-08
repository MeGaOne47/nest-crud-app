/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty() 
  @MinLength(3) 
  @MaxLength(30) 
  username: string; 
  
  @IsString()
  @MinLength(8)
  @MaxLength(60)
  password: string;

}