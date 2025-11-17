export interface IJWTUser {
  sub: string;
  exp: number;
  iat: number;
  iss?: string;
  aud?: string;
}

export interface IUserPermission {}

export interface IAuthUser {
  id: string | number;
  email: string;
  name?: string;
}
