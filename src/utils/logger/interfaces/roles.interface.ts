import { IUser } from './user.interface';

export interface IRole {
  id: number;
  name: string;
  users?: IUser[];
}
