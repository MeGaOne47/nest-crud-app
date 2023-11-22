/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Role } from 'src/role/enum/role.enum';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (req.user && req.user.roles.includes(Role.Admin)) {
      req.isAdmin = true;
    } else {
      req.isAdmin = false;
    }
    next();
  }
}