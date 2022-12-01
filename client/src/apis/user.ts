import { GetWorkspaceParams } from '@common/types/params/user';

import { http } from './http';
import { OK } from './http-status';

export const getWorkspaces = async ({ id }: GetWorkspaceParams) => {
  const res = await http.get(`/user/${id}/workspace`);

  if (res.status !== OK) throw new Error();

  return res.data;
};
