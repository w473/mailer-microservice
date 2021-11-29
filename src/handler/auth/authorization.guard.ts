import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { KeycloakJwtToken } from './models/keycloak.jwt.token';
import { getUserFromKeycloakJwtToken } from 'src/handler/auth/models/user';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_AUTHORIZATION_HEADER } from 'src/statics';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private readonly authorizationHeader: string;
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    this.authorizationHeader =
      configService.get('AUTHORIZATION_HEADER') || DEFAULT_AUTHORIZATION_HEADER;
  }

  canActivate(context: ExecutionContext): boolean {
    if (this.reflector.get<boolean>('public', context.getHandler())) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    try {
      const token = request.header(this.authorizationHeader);
      if (token) {
        const jwt = <KeycloakJwtToken>(
          JSON.parse(Buffer.from(token, 'base64').toString())
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
