
declare namespace Express {
    export interface Request {
      token?: string;
      authId?: string;
    }
  }