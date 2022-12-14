import { User } from './user';

export interface PostLoginBody {
  code: string;
}

export interface LoginResBody {
  user: User;
}
