export interface Workspace {
  id: number;
  name: string;
  code: string;
}

export interface PostParams {
  name: string;
}

export interface PostJoinParams {
  code: string;
}

export interface GetInfoParams {
  id: string;
}
