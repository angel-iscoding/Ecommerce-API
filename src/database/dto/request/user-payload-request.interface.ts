import { Request } from 'express';

export interface IUserPayloadRequest extends Request {
  user: {
    id: string;
    [key: string]: any;
  };
}
