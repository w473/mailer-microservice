import { Strategy } from 'passport-strategy';
import { Request } from 'express';
import { KeycloakJwtToken } from './models/keycloak.jwt.token';

export class JwtPassportStrategy extends Strategy {
  name = 'jwt';

  authenticate(req: Request): void {
    try {
      const bearer = req
        .header('Authorization')
        ?.replace('Bearer ', '')
        ?.split('.')[1];
      if (bearer) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const jwt = <KeycloakJwtToken>(
          JSON.parse(Buffer.from(bearer, 'base64').toString())
        );
        this.success(jwt);
        return;
      }
      this.fail(401);
    } catch (error) {
      this.error(<Error>error);
    }
  }
}
