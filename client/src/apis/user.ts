import { GetWorkspaceParams, GetWorkspacesResBody } from 'params/user';

import { http } from './http';
import { OK } from './http-status';

export const getWorkspaces = async ({
  id,
}: GetWorkspaceParams): Promise<GetWorkspacesResBody> => {
  const res = await http.get(`/user/${id}/workspace`);

  if (res.status !== OK) throw new Error();

  return res.data;
};
