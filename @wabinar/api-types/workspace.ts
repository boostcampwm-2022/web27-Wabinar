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

export interface GetInfoParams {
  id: string;
}
