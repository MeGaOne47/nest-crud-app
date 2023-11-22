/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UseGuards, Request, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { LocalGuard } from "./guard/local.guard";
import { JwtGuard } from "./guard/jwt.guard";
import { Roles } from "./decorator/roles.decorator";
import { Role } from "src/role/enum/role.enum";
import { RolesGuard } from "./guard/role.guard";
import { RegisterUserDto } from "src/users/dto/register-user.dto";


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }
  
  // ..../auth/register
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    await this.authService.register(registerUserDto);
  }

  // ..../auth/login
  @Roles(Role.Admin, Role.User)
  @Post('login')
  @UseGuards(LocalGuard, RolesGuard)
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  // ..../auth/profile
  @Get('profile')
  @UseGuards(JwtGuard)
  profile(@Request() req) {
    return req.user;
  }

  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('admin')
  onlyAdmin(@Request() req) {
    return req.user;
  }
}