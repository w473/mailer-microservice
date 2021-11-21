import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { KeycloakJwtToken } from './models/keycloak.jwt.token';
import { getUserFromKeycloakJwtToken } from 'src/handler/auth/models/user';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (this.reflector.get<boolean>('public', context.getHandler())) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    try {
      const bearer = request
        .header('Authorization')
        ?.replace('Bearer ', '')
        ?.split('.')[1];
      if (bearer) {
        const jwt = <KeycloakJwtToken>(
          JSON.parse(Buffer.from(bearer, 'base64').toString())
        );
        request.user = getUserFromKeycloakJwtToken(jwt);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}
