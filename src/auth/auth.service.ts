/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { randomBytes, scrypt as _scrypt } from "crypto";

import { promisify } from "util";
import { User } from "src/users/user.entity";
// import { CreateUserDto } from "src/users/dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { Role } from "src/role/enum/role.enum";
import { RegisterUserDto } from "src/users/dto/register-user.dto";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  [x: string]: any;
  constructor(
    @InjectRepository(User) 
    private userRepository: Repository<User>, 
    private jwtService: JwtService
    
    ) {
  }


  async register(registerUserDto: RegisterUserDto) {
    const {email, password, username} = registerUserDto;
    
    // checking user already exists or not
    const user = await this.userRepository.findOne({where: {email}});
    if (user) {
      throw new BadRequestException('User Already Exists')
    }
    
    // hashing the password with salt
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');
    
    // saving the user
    const newUser = this.userRepository.create({email, password: hashedPassword, username, roles: [Role.User] });
    
    await this.userRepository.save(newUser);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({where: {email}});
    if (user) {
      const [salt, hashedPassword] = user.password.split('.');

      const controlHashedPassword = (await scrypt(password, salt, 32)) as Buffer;
      if (hashedPassword === controlHashedPassword.toString('hex')) {
        return user;
      }
    }
    return null;
  }

  login(user: User) {
    const payload = {
      sub: user.id, 
      email: user.email, 
      username: user.username,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload)
    }
  }


}