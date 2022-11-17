import { PostJoinParams, PostParams } from 'params/workspace';
import { Workspace } from 'src/types/workspace';

import { http } from './http';
import { CREATED } from './http-status';

export const postWorkspace = async ({
  name,
}: PostParams): Promise<Workspace> => {
  const res = await http.post(`/workspace`, { name });

  if (res.status !== CREATED) throw new Error();

  return res.data;
};

export const postWorkspaceJoin = async ({
  code,
}: PostJoinParams): Promise<Workspace> => {
  const res = await http.post(`/workspace/join`, { code });

  if (res.status !== CREATED) throw new Error();

  return res.data;
};
