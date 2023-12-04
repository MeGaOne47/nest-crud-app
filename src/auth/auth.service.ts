/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { randomBytes, scrypt as _scrypt } from "crypto";

import { promisify } from "util";
import { User } from "src/users/user.entity";
// import { CreateUserDto } from "src/users/dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { Role } from "src/role/enum/role.enum";
import { RegisterUserDto } from "src/users/dto/register-user.dto";
import * as nodemailer from 'nodemailer';

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
    const user = await this.userRepository.findOne({ where: { email }, relations: ['donor'] });
  
    if (user) {
      // Kiểm tra xem tài khoản có bị khóa không
      if (user.isLocked) {
        throw new UnauthorizedException('Tài khoản đã bị khóa.');
      }
  
      const [salt, hashedPassword] = user.password.split('.');
      const controlHashedPassword = (await scrypt(password, salt, 32)) as Buffer;
  
      if (hashedPassword === controlHashedPassword.toString('hex')) {
        // Nếu đăng nhập thành công, reset số lần nhập sai về 0
        await this.userRepository.update({ id: user.id }, { loginAttempts: 0 });
        const updatedUser = await this.userRepository.findOne({ where: { id: user.id } });
  
        if (updatedUser && updatedUser.loginAttempts === 0) {
          // Log số lần nhập sai vào console
          console.log(`Số lần nhập sai cho tài khoản ${user.email}: ${updatedUser.loginAttempts}`);
          return user;
        }
      } else {
        // Nếu mật khẩu không đúng, tăng số lần nhập sai
        await this.userRepository.increment({ id: user.id }, 'loginAttempts', 1);
  
        // Lấy số lần nhập sai từ cơ sở dữ liệu sau khi tăng
        const updatedUser = await this.userRepository.findOne({ where: { id: user.id } });
  
        if (updatedUser) {
          // Log số lần nhập sai vào console
          console.log(`Số lần nhập sai cho tài khoản ${user.email}: ${updatedUser.loginAttempts}`);
  
          // Kiểm tra xem số lần nhập sai có vượt quá ngưỡng không
          if (updatedUser.loginAttempts >= 3) {
            // Nếu vượt quá ngưỡng, khóa tài khoản
            await this.userRepository.update({ id: user.id }, { isLocked: true });
            throw new UnauthorizedException('Tài khoản đã bị khóa.');
          }
        }
  
        throw new UnauthorizedException('Mật khẩu không đúng.');
      }
    }
  
    throw new UnauthorizedException('Không tìm thấy tài khoản.');
  }
  

  async login(user: User) {
    const payload = {
      sub: user.id, 
      email: user.email, 
      username: user.username,
      roles: user.roles,
      donor: user.donor.id,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = randomBytes(32).toString('hex');

    // Lưu refreshToken vào cơ sở dữ liệu hoặc nơi lưu trữ khác
    user.refreshToken = refreshToken;

    // Reset số lần nhập sai về 0
    user.loginAttempts = 0;

    await this.userRepository.save(user);
    
    console.log(`Số lần nhập sai sau khi đăng nhập thành công: ${user.loginAttempts}`);
    return {
      // access_token: this.jwtService.sign(payload)
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }

  async refreshToken(refreshToken: string) {
    const user = await this.userRepository.findOne({ where: { refreshToken } });
  
    if (!user) {
      // refreshToken không hợp lệ
      return null;
    }
  
    // Tạo access token mới
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles,
      donor: user.donor.id,
    };
  
    const newAccessToken = this.jwtService.sign(payload);
  
    return {
      access_token: newAccessToken,
    };
  }

  private generateOTP(): string {
    // Tạo mã OTP ngẫu nhiên 6 chữ số
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = this.generateOTP();
    // Lưu OTP vào user (có thể lưu vào cơ sở dữ liệu hoặc bất kỳ cách nào khác phù hợp)
    user.resetToken = otp;
    await this.userRepository.save(user);

    // Gửi email chứa OTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'nguyentanhung9a1@gmail.com',
        pass: 'ssonbvlpulaehfxp',
      },
    });

    const mailOptions = {
      from: 'nguyentanhung9a1@gmail.com', // Thay bằng địa chỉ email Gmail của bạn
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw new BadRequestException('Failed to send email');
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

  async verifyOTP(email: string, otp: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email, resetToken: otp } });
    if (!user) {
      throw new BadRequestException('Invalid OTP');
    }
    return user;
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    const user = await this.verifyOTP(email, otp);

    // Thực hiện logic đặt lại mật khẩu ở đây
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(newPassword, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');

    // Lưu lại mật khẩu mới
    user.password = hashedPassword;
    user.resetToken = null; // Xóa OTP sau khi đã sử dụng
    await this.userRepository.save(user);
  }
  
  async logout(id: number, refreshToken: string): Promise<void> {
    // Kiểm tra và hủy refresh token ở đây
    const user = await this.userRepository.findOne({ where: { id } });

    if (user && user.refreshToken === refreshToken) {
      user.refreshToken = null;
      await this.userRepository.save(user);
    }
  }
}