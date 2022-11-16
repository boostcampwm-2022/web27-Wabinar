import { http } from './http';
import { OK } from './http-status';

export const getWorkspaces = async (userId: number) => {
  const res = await http.get(`/user/${userId}/workspace`);

  if (res.status !== OK) throw new Error();

  return res.data;
};
