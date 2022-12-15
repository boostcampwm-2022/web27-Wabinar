import { LoginResBody, PostLoginBody } from '@wabinar/api-types/auth';

import { http } from './http';
import { CREATED, OK } from './http-status';

export const getAuth = async (): Promise<LoginResBody> => {
  const res = await http.get(`/auth`);

  if (res.status !== OK) throw new Error();

  return res.data;
};

export const postAuthLogin = async ({
  code,
}: PostLoginBody): Promise<LoginResBody> => {
  const res = await http.post(`/auth/login`, { code });

  if (res.status !== CREATED) throw new Error();

  return res.data;
};

export const deleteAuthlogout = async () => {
  const res = await http.delete(`/auth/logout`);

  if (res.status !== OK) throw new Error();

  return;
};
