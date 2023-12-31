/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UseGuards, Request, Get, Patch, Param, HttpCode, Req} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { LocalGuard } from "./guard/local.guard";
import { JwtGuard } from "./guard/jwt.guard";
import { Roles } from "./decorator/roles.decorator";
import { Role } from "src/role/enum/role.enum";
import { RolesGuard } from "./guard/role.guard";
import { RegisterUserDto } from "src/users/dto/register-user.dto";
import { LogoutDto } from "src/users/dto/loguot-user.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('auth')
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
  @Roles(Role.Admin, Role.User)
  @Get('profile')
  @UseGuards(JwtGuard, RolesGuard)
  profile(@Request() req) {
    return req.user;
  }

  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('admin')
  onlyAdmin(@Request() req) {
    return req.user;
  }

  @Post('refresh-token')
  // @UseGuards(JwtGuard)
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    await this.authService.sendPasswordResetEmail(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; otp: string; newPassword: string }) {
    const { email, otp, newPassword } = body;
    await this.authService.resetPassword(email, otp, newPassword);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@Req() req, @Body() logoutDto: LogoutDto): Promise<{ message: string }> {
    const userId = req.user.id;
    await this.authService.logout(userId, logoutDto.refreshToken);
    return { message: 'Logout successful' };
  }
}