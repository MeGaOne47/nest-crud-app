/* eslint-disable prettier/prettier */
// auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Kiểm tra trạng thái đăng xuất
    if (req.user) {
      return res.status(401).json({ message: 'User has logged out' });
    }
    next();
  }
}
