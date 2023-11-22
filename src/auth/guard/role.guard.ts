/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/role/enum/role.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log("du lieu gi day",requiredRoles);
    console.log("du lieu gi day",{ user });
    // Kiểm tra xem user và user.roles có tồn tại không
    if (!user || !user.roles) {
      return false; // hoặc return true nếu bạn muốn cho phép truy cập nếu không có user hoặc roles
    }
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
