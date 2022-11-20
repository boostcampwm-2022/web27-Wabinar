import { User } from './user';

export interface LoginResponseBody extends User {}

export interface PostLoginBody {
  code: string;
}
