interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: '2oAnULXGxg0D9JZAI9NRIXXNBakNaZKz',
  domain: 'rosen-emp.eu.auth0.com',
  callbackURL: 'http://localhost:4200/callback'
};
