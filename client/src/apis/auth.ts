import { PostLoginParams } from 'params/auth';

import { http } from './http';
import { OK, CREATED } from './http-status';

export const getAuth = async () => {
  try {
    const res = await http.get(`/auth`);

    if (res.status !== OK) return null;

    return res.data;
  } catch (e) {
    return null;
  }
};

export const postAuthLogin = async ({ code }: PostLoginParams) => {
  const res = await http.post(`/auth/login`, { code });

  if (res.status !== CREATED) throw new Error();

  return res.data;
};

export const deleteAuthlogout = async () => {
  const res = await http.delete(`/auth/logout`);

  if (res.status !== OK) throw new Error();

  return;
};
