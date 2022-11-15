import { OK, CREATED } from './http-status';
import { baseRequest } from './util';

export const getAuth = async () => {
  const res = await baseRequest.get(`/auth`);

  if (res.status !== OK) throw new Error();

  return res.data;
};

export const postAuthLogin = async (code: string) => {
  const res = await baseRequest.post(`/auth/login`, { code });

  if (res.status !== CREATED) throw new Error();

  return res.data;
};

export const deleteAuthlogout = async () => {
  const res = await baseRequest.delete(`/auth/logout`);

  if (res.status !== OK) throw new Error();

  return;
};
