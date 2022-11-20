import { GetWorkspaceParams, GetWorkspaceResBody } from '@wabinar/types/user';

import { http } from './core/http';
import { OK } from './core/http-status';

export const getWorkspaces = async ({
  id,
}: GetWorkspaceParams): Promise<GetWorkspaceResBody> => {
  const res = await http.get(`/user/${id}/workspace`);

  if (res.status !== OK) throw new Error();

  return res.data;
};
