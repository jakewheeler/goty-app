import { Request } from 'express';

export interface IGetUserAuthRequest extends Request {
  token: string;
  authId: string;
}
