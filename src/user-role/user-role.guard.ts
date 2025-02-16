import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private userRole: string[]) {}
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const user: User | undefined = req.user as User;
    if (!user || !this.userRole.includes(user.role)) {
      throw new ForbiddenException(
        "You don't have access. Only admin have access to delete!",
      );
    }
    req.user = user;
    return true;
  }
}
