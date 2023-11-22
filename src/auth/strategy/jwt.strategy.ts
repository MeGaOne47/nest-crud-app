/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { secretKey } from "../constants/jwt-constants";
import { Role } from "src/role/enum/role.enum";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKey: secretKey,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false
    });
  }

  validate(payload: {sub: string, email: string, username: string, roles: Role[]}) {
    console.log('JWT Payload:', payload);
    return {
      id: payload.sub, 
      email: payload.email, 
      username: payload.username, 
      roles: payload.roles
    };
  }
}
