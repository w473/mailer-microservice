import { KeycloakJwtToken } from 'src/handler/auth/models/keycloak.jwt.token';

export class User {
  roles: string[];
}

export const getUserFromKeycloakJwtToken = (token: KeycloakJwtToken): User => {
  const user = new User();
  user.roles = token?.realm_access?.roles ?? [];
  return user;
};
