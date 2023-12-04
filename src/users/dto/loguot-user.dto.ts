/* eslint-disable prettier/prettier */
// logout.dto.ts
import { IsNotEmpty } from 'class-validator';

export class LogoutDto {
  @IsNotEmpty()
  refreshToken: string;
}
