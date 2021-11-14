import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { KeycloakJwtToken } from './models/keycloak.jwt.token';

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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const jwt = <KeycloakJwtToken>(
          JSON.parse(Buffer.from(bearer, 'base64').toString())
        );
        request.user = jwt;
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}
