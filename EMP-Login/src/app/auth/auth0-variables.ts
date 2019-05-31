interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'KxB2w1j2g0CrQQoOvyXcDv9uY2ehkeob',
  domain: 'rosen-emp.eu.auth0.com',
  callbackURL: 'http://localhost:3000/callback'
};
