/* eslint-disable prettier/prettier */

import { Exclude, Expose, Type } from "class-transformer";
// import { Role } from "src/role/enum/role.enum";
import { DisplayUserDto } from "src/users/dto/display-user.dto";

/* eslint-disable prettier/prettier */
@Exclude()
export class DisplayDonorDto {
    @Expose()
    id: number;
    @Expose()
    fullName: string;
    @Expose()
    birthDate: Date;
    @Expose()
    gender: string;
    @Expose()
    address: string;
    @Expose()
    phoneNumber: string;
    @Expose()
    bloodType: string;
    @Expose()
    rhFactor: string;
    // @Expose()
    // user: {
    //     id: number;
    //     email: string;
    //     username: string;
    //     roles: Role[];
    //     // Thêm các trường khác nếu cần
    //   };
    @Expose()
    @Type(() => DisplayUserDto) // Transform UserDto
    user: DisplayUserDto;
  }
  