/* eslint-disable prettier/prettier */
import { Exclude, Expose } from "class-transformer";
import { Role } from "src/role/enum/role.enum";

/* eslint-disable prettier/prettier */
@Exclude()
export class DisplayUserDto {
    @Expose()
    id: number;
    @Expose()
    email: string;
    @Expose()
    username: string;
    @Expose()
    roles: Role[];
  }