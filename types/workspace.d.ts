import { Mom } from './mom';
import { User } from './user';

export interface Workspace {
  id: number;
  name: string;
  code: string;
}

export interface PostBody {
  name: string;
}

export interface PostJoinBody {
  code: string;
}

export interface GetParams {
  id: string;
}

export interface GetResBody {
  users: User[];
  moms: Mom[];
}

export interface PostMomParams {
  id: string;
}

export interface PostMomResBody extends Mom {}
