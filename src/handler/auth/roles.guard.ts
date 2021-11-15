import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { KeycloakJwtToken } from './models/keycloak.jwt.token';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (this.reflector.get<boolean>('public', context.getHandler())) {
      return true;
    }
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = <KeycloakJwtToken>request.user;

    for (let i = 0; i < roles.length; i++) {
      if (user.realm_access.roles.find((role) => role === roles[i])) {
        return true;
      }
    }
    return false;
  }
}
