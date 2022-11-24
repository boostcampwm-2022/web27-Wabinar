import { PostLoginParams } from 'params/auth';
import { GetUserInfo } from 'src/types/workspace';

import { http } from './http';
import { CREATED, OK } from './http-status';

export const getAuth = async (): Promise<GetUserInfo> => {
  const res = await http.get(`/api/auth`);

  if (res.status !== OK) throw new Error();

  return res.data;
};

export const postAuthLogin = async ({
  code,
}: PostLoginParams): Promise<GetUserInfo> => {
  const res = await http.post(`/api/auth/login`, { code });

  if (res.status !== CREATED) throw new Error();

  return res.data;
};

export const deleteAuthlogout = async () => {
  const res = await http.delete(`/api/auth/logout`);

  if (res.status !== OK) throw new Error();

  return;
};
