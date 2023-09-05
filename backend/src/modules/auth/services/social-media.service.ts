export interface SocialMediaIdTokenPayload {
  iss: string;
  sub: string;
  aud: string;
  iat: string | number;
  exp: string | number;
  email_verified?: string | boolean;
  email?: string;
  picture?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
}

export enum SocialMediaAuthType {
  Register = 'REGISTER',
  Login = 'LOGIN',
}

export abstract class SocialMediaService {
  abstract getOIDCData(
    code: string,
    authType?: SocialMediaAuthType,
  ): Promise<SocialMediaIdTokenPayload>;
}
