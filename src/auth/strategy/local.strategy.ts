/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      // this assignment is to use email instead of username while validating
      usernameField: 'email'
    });
  }
  
  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    console.log("validate user:",user);
    if (!user) {
      throw new BadRequestException('Wrong Credentials');
    }
    return user;
  }
}