import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPassportStrategy } from './jwt.passport.strategy';
import { KeycloakJwtToken } from './models/keycloak.jwt.token';

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtPassportStrategy) {
  validate(payload: KeycloakJwtToken): KeycloakJwtToken {
    //nothing to validate, we assume that it was validated already (sidecar/istio)
    return payload;
  }
}
