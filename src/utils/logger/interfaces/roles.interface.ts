import { IUser } from './user.interface';

export interface IRole {
  id: string;
  name: string;
  users?: IUser[];
}
