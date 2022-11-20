import { PostBody, PostJoinBody, Workspace } from '@wabinar/types/workspace';

import { http } from './core/http';
import { CREATED } from './core/http-status';

export const postWorkspace = async ({ name }: PostBody): Promise<Workspace> => {
  const res = await http.post(`/workspace`, { name });

  if (res.status !== CREATED) throw new Error();

  return res.data;
};

export const postWorkspaceJoin = async ({
  code,
}: PostJoinBody): Promise<Workspace> => {
  const res = await http.post(`/workspace/join`, { code });

  if (res.status !== CREATED) throw new Error();

  return res.data;
};
