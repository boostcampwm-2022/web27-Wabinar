import { PostLoginBody } from '@wabinar/types/auth';
import { User } from '@wabinar/types/user';

import { http } from './core/http';
import { OK, CREATED } from './core/http-status';

export const getAuth = async (): Promise<User | null> => {
  try {
    const res = await http.get(`/auth`);

    if (res.status !== OK) return null;

    return res.data;
  } catch (e) {
    return null;
  }
};

export const postAuthLogin = async ({ code }: PostLoginBody): Promise<User> => {
  const res = await http.post(`/auth/login`, { code });

  if (res.status !== CREATED) throw new Error();

  return res.data;
};

export const deleteAuthlogout = async () => {
  const res = await http.delete(`/auth/logout`);

  if (res.status !== OK) throw new Error();

  return;
};
