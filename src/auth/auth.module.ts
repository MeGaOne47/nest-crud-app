/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { User } from "src/users/user.entity";
import { LocalStrategy } from "./strategy/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { secretKey } from "./constants/jwt-constants";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { SessionSerializer } from "./session/session.serializer";
// import { RefreshTokenStrategy } from "./strategy/refreshToken.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ session: true }),
    JwtModule.register({
        secret: secretKey,
        signOptions: {expiresIn: '1h'}
      })
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    LocalStrategy, 
    JwtStrategy, 
    // RefreshTokenStrategy,
    SessionSerializer,
  ]
})
export class AuthModule {}