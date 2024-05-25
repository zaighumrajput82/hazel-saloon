// permissions.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get allowed roles from both class and method
    const classRoles =
      this.reflector.get<string[]>('allowedRoles', context.getClass()) || [];
    const methodRoles =
      this.reflector.get<string[]>('allowedRoles', context.getHandler()) || [];

    // Combine roles and remove duplicates
    const allowedRoles = [...new Set([...classRoles, ...methodRoles])];

    if (!allowedRoles) {
      return true; // No specific roles required, so access is granted
    }

    const request = context.switchToHttp().getRequest();
    const userRoles = Array.isArray(request.user?.role)
      ? request.user.role
      : [request.user?.role].filter(Boolean);

    if (
      !userRoles ||
      !userRoles.some((role) =>
        allowedRoles.includes(role.trim().toLowerCase()),
      )
    ) {
      throw new UnauthorizedException(
        'You do not have the required permissions.',
      );
    }

    return true; // User has the required roles
  }
}
